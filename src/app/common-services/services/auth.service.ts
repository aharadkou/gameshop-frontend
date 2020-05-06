import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { from, of, Observable, BehaviorSubject, combineLatest, throwError } from 'rxjs';
import { tap, catchError, concatMap, shareReplay, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CLIENT_ID, APP_NAMESPACE } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth0Client$ = (from(
    createAuth0Client({
      domain: 'dev-vhc0s9zz.eu.auth0.com',
      client_id: CLIENT_ID,
      redirect_uri: `${window.location.origin}`,
      audience: 'https://gameshop-api',
      useRefreshTokens: true
    })
  ) as Observable<Auth0Client>).pipe(
    shareReplay(1),
    catchError(err => throwError(err))
  );

  isAuthenticated$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.isAuthenticated())),
    tap(res => this.loggedIn = res)
  );

  handleRedirectCallback$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
  );

  private userProfileSubject$ = new BehaviorSubject<any>(null);

  userProfile$ = this.userProfileSubject$.asObservable();
  userRoles$ = this.userProfileSubject$.pipe(
    switchMap(user => of(user ? user[APP_NAMESPACE + '/roles'] : [])
    )
  );
  loggedIn: boolean = null;

  constructor(private router: Router) {
    this.localAuthSetup();
    this.handleAuthCallback();
  }

  getUser$(options?): Observable<any> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options))),
      tap(user => this.userProfileSubject$.next(user))
    );
  }

  private localAuthSetup() {
    const checkAuth$ = this.isAuthenticated$.pipe(
      concatMap((loggedIn: boolean) => {
        if (loggedIn) {
          return this.getUser$();
        }
        return of(loggedIn);
      })
    );
    checkAuth$.subscribe();
  }

  login(redirectPath: string = '/') {
    this.auth0Client$.subscribe((client: Auth0Client) => {
      client.loginWithRedirect({
        redirect_uri: `${window.location.origin}`,
        appState: { target: redirectPath }
      });
    });
  }

  getTokenSilently$(options?): Observable<string> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getTokenSilently(options)))
    );
  }

  private handleAuthCallback() {
    const params = window.location.search;
    if (params.includes('code=') && params.includes('state=')) {
      let targetRoute: string;
      const authComplete$ = this.handleRedirectCallback$.pipe(
        tap(cbRes => {
          targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
        }),
        concatMap(() => {
          return combineLatest([
            this.getUser$(),
            this.isAuthenticated$
          ]);
        })
      );
      authComplete$.subscribe(([user, loggedIn]) => {
        this.router.navigate([targetRoute]);
      });
    }
  }

  logout() {
    this.auth0Client$.subscribe((client: Auth0Client) => {
      client.logout({
        client_id: CLIENT_ID,
        returnTo: `${window.location.origin}`
      });
    });
  }

  hasRole(roleName: string) {
    const user = this.userProfileSubject$.getValue();
    const userRoles = user ? user[APP_NAMESPACE + '/roles'] : [];
    return !!userRoles.find((role: any) => role === roleName);
  }

}
