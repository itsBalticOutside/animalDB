import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import WebService from "./web.service";


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
  image: File | undefined;
  Comments: any;
  Rating: any

  animal: any;
  collection_name: any = [];
  uploadForm: any;

  constructor(private http: HttpClient,
              private formBuilder: FormBuilder,
              private webService: WebService) { }

  ngOnInit(){
     //Building upload forms
    this.uploadForm = this.formBuilder.group({
      Species: ['',],
      Gender: ['', Validators.required],
      LifeStage: ['', Validators.required],
      Location: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  //Post animal details to database
  onSubmit(){
     if (this.uploadForm.valid){
      this.webService.postAnimal(this.uploadForm.value).subscribe((response:any) =>{});
      this.uploadForm.reset();
     }
    
  }


}
