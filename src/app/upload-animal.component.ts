import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import WebService from "./web.service";
import { Router } from '@angular/router';

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
  Comments: any;
  Rating: any

  file : any
  imageFile: File | undefined;
  imageData : any;
  imagePath: any = "";
  imageFormUploadButtonValid: boolean = false;

  animal: any;
  collection_name: any = [];

  uploadForm: any;
  imageForm: any;
  constructor(private http: HttpClient,
              private router: Router,
              private formBuilder: FormBuilder,
              private webService: WebService) { }

  ngOnInit(){
     //Building upload forms
    this.uploadForm = this.formBuilder.group({
      Species: ['',],
      Gender: ['', Validators.required],
      LifeStage: ['', Validators.required],
      Location: ['', Validators.required],
      image: ["", Validators.required],
    });
    this.imageForm = this.formBuilder.group({
      imageFile: [null, Validators.required],
    });
  }

  //Post animal details to database
  onSubmit(){
     if (this.uploadForm.valid){
      //Post animal to backend
        this.webService.postAnimal(this.uploadForm.value).subscribe((response:any) =>{
          this.uploadForm.reset();
          this.imageForm.reset();
          var animalURL = response.url
          //Nav to new observation
          this.router.navigate([animalURL]);
        });
     }
  }
  //Upload image to blob
  onImageSubmit(){
    if (this.imageForm.valid){
      //Upload image to blob endpoint
     this.webService.imageUpload(this.imageForm.get('imageFile').value).subscribe((response:any) =>{
       //Save respone (Blob url)
       var imageURL = response;
       imageURL = imageURL.image
       //Set image url to blob url
       this.uploadForm.patchValue({image : imageURL});
     })
    }
 }

//When file loaded
 onFileSelected(event: any) {
  if (event.target.files && event.target.files.length > 0) {
     this.file = event.target.files[0];
     this.imageFormUploadButtonValid = false;
     const maxFileSize = 4 * 1024 * 1024; // 4 MB in bytes
     const allowedFileTypes = ["image/png", "image/jpeg", "image/bmp"]; 
     //Error or large file
     if (this.file.size > maxFileSize) {
      this.imageFormUploadButtonValid = false;
      this.imageForm.controls['imageFile'].setErrors({'invalidFileSize': true});
      console.log("File size too large");
     } 
     //Error for bad filetype
     else if (!allowedFileTypes.includes(this.file.type)) {
      this.imageFormUploadButtonValid = false;
      this.imageForm.controls['imageFile'].setErrors({'invalidFileType': true});
      console.log("File type not allowed");
     }
     else {
      this.imageFormUploadButtonValid = true //Image upload button enabled
      //Reading and loading file 
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.imageData = reader.result as string;
        this.imageForm.patchValue({imageFile : this.file});
      };
    }
  }
}


}
