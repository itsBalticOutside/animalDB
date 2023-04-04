import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { WebService } from "./web.service";


@Component({
  selector: 'app-upload-animal',
  templateUrl: './upload-animal.component.html',
  styleUrls: ['./upload-animal.component.css']
})
export class UploadAnimalComponent {

  Species: any;
  Gender: any;
  LifeStage: any;
  Location: any;
  Image: any;
  Comments: any;
  Rating: any

  animal: any;
  collection_name: any = [];
  reviewForm: any;

  constructor(private http: HttpClient,
              private formBuilder: FormBuilder,
              private webService: WebService) { }

  ngOnInit(){
     //Building review and edit forms
    this.reviewForm = this.formBuilder.group({
      Species: ['', Validators.required],
      Gender: ['', Validators.required],
      LifeStage: ['', Validators.required],
      Location: ['', Validators.required],
      image: ['', Validators.required]
    });

    this.collection_name = this.webService.getCollections();
  }

    //submit review button
    onSubmit(){
     
      this.webService.postReview(this.reviewForm.value).subscribe((response:any) =>{});
      this.reviewForm.reset();
  }
  
}
