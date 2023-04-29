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
  Comments: any;
  Rating: any

  imageFile: File | undefined;
  imageData : any;
  imagePath: any = "";
  animal: any;
  collection_name: any = [];
  uploadForm: any;
  imageForm: any;
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
      image: ["", Validators.required],
    });
    this.imageForm = this.formBuilder.group({
      imageFile: [null, Validators.required],
    });
  }

  //Post animal details to database
  onSubmit(){
     if (this.uploadForm.valid){
     
        this.webService.postAnimal(this.uploadForm.value).subscribe((response:any) =>{});
        this.uploadForm.reset();
      
     }
    
  }
  onImageSubmit(){
    if (this.imageForm.valid){
     this.webService.imageUpload(this.imageForm.get('imageFile').value).subscribe((response:any) =>{
       var imageURL = response;
       imageURL = imageURL.image
       console.log("blobreturn: "+imageURL)

       this.uploadForm.patchValue({image : imageURL});

       console.log("formurl"+this.uploadForm.get("image").value)

     })
     
    }
   
 }

 onFileSelected(event: any) {
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageData = reader.result as string;
      console.log("imgData"+this.imageData)
      this.imageForm.patchValue({imageFile : file});
      console.log(this.imageForm.get("image").value)
    };
  }
}


}
