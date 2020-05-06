import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/common-services/interfaces/product.model';
import { FileValidator } from 'ngx-material-file-input';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Category } from 'src/app/common-services/interfaces/category.model';

@Component({
  selector: 'gs-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  @Input() product: Product;
  @Output() formSubmited: EventEmitter<FormData> = new EventEmitter<FormData>();

  uploadedImageUrl: string | ArrayBuffer;
  form: FormGroup;
  private readonly maxImageSize = 10485760;
  private imageSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: this.formBuilder.control(this.product.title, [Validators.required]),
      description: this.formBuilder.control(this.product.description),
      price: this.formBuilder.control(this.product.price, [Validators.required, Validators.min(0)]),
      categories: this.formBuilder.control(this.product.categories),
      image: this.formBuilder.control(null, [FileValidator.maxContentSize(this.maxImageSize)])
    });
    this.imageSubscription = this.form.get('image').valueChanges.subscribe(value => {
      const file = this.image.value ? this.image.value._files[0] : null;
      if (file) {
        const reader = new FileReader();
        reader.onload = () => this.uploadedImageUrl = reader.result;
        reader.readAsDataURL(file);
      } else {
        this.uploadedImageUrl = '';
      }
    });
  }

  submit() {
    const formValue = this.form.value;
    const formData = new FormData();
    formData.append('title', formValue.title);
    formData.append('description', formValue.description);
    formData.append('price', formValue.price);
    formData.append('categories',
      JSON.stringify(
        formValue.categories.map((category: Category) => category.id)
      )
    );
    if (formValue.image) {
      formData.append('image', formValue.image._files[0]);
    }
    this.formSubmited.next(formData);
  }

  get image() {
    return this.form.get('image');
  }

  get title() {
    return this.form.get('title');
  }

  get description() {
    return this.form.get('description');
  }

  get price() {
    return this.form.get('price');
  }

  get categories() {
    return this.form.get('categories');
  }

  removeImage() {
    this.uploadedImageUrl = null;
    this.product.imageUrl = null;
    this.image.setValue(null);
    this.form.markAsDirty();
  }

  cancel() {
    if (!this.form.pristine) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: 'Are you sure want to leave without saving?'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigateByUrl('');
        }
      });
    } else {
      this.router.navigateByUrl('');
    }
  }

  ngOnDestroy() {
    if (this.imageSubscription) {
      this.imageSubscription.unsubscribe();
    }
  }

}
