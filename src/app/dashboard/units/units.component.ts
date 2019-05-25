import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {SubCategoryService} from '../../services/sub-category.service';
import {HttpParams} from '@angular/common/http';
import {AddEditSubCategoryDetailsModalComponent} from '../sub-category-details/sub-category-details.component';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {

  unitList = [];
  loaded = false;
  displayedColumns = ['no', 'name', 'actions'];

  constructor(public dialog: MatDialog, private _subCat: SubCategoryService, public snackbar: MatSnackBar,) { }

  ngOnInit() {
    this.refreshList();
  }

  async refreshList() {
    try {
     const res: any = await this._subCat.getUnits();
     this.unitList = res;
     this.loaded = true;
    } catch (err) {
      console.error(err);
    }
  }

  openUnitModal() {
    const dialogRef = this.dialog.open(AddEditUnitModalComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshList();
    });
  }

  changeUnitStatus(index) {
    this.unitList[index].status = this.unitList[index].status === '1' ? '0' : '1';
    const object = new HttpParams()
      .set('id', this.unitList[index].id)
      .set('status', this.unitList[index].status === '1' ? '0' : '1');
    this._subCat.changeUnitStatus(object)
      .then(data => {
        const status = this.unitList[index].status === '0' ? 'De-activated' : 'Activated';
        this.snackbar.open('Your Unit has been ' + status, 'Success', {
          duration: 2000
        });
      })
      .catch(err => {
        console.error(err);
        this.unitList[index].status = this.unitList[index].status === '1' ? '0' : '1';
        const error = 'Internal Server Error';
        this.snackbar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

}


@Component({
  templateUrl: 'add-edit-unit-modal.html',
})
export class AddEditUnitModalComponent {
  unitForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data,
    public snackbar: MatSnackBar, private _subCat: SubCategoryService) {
    this.initializeSubCategoryForm();
  }

  closeModal() {
    this.dialogRef.close();
  }

  initializeSubCategoryForm() {
    this.unitForm = new FormGroup({
      name: new FormControl(null, Validators.required)
    });
  }

  addEditUnit() {
    if (this.unitForm.valid) {
        const object = new HttpParams()
          .set('name', this.unitForm.controls['name'].value);
        this._subCat.addUnit(object)
          .then(data => {
            this.closeModal();
          }).catch(err => {
          console.error(err);
        });
    } else {
      this.snackbar.open('Error', 'Please Enter Name of Unit', {
        duration: 4000
      });
    }
  }

}
