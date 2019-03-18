import {Component, OnInit} from '@angular/core';
import {SliderService} from '../../services/slider.service';
import {MatSnackBar} from '@angular/material';
import {environment} from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  sliderCustomOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    center: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  };

  sliderList = [];
  loaded = false;
  imageUrl = environment.imageUrl;

  constructor(private _sliderService: SliderService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.refreshSliders();
  }

  refreshSliders() {
    this._sliderService.getDashboardSliders()
      .subscribe(data => {
        console.log(data);
        this.sliderList = data;
        this.loaded = true;
      }, err => {
        console.error(err);
        this.loaded = true;
        const error = (err.error && err.error.message) ? err.error.message : 'Internal Server Error';
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

  deleteSlider(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.deleteSelectedSlider(id);
      }
    });
  }

  deleteSelectedSlider(id) {
    this._sliderService.deleteSlider({id: id})
      .subscribe(data => {

        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      }, err => {
        console.error(err);
      });
  }

}
