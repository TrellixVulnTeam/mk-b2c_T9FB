import { Component, Directive, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { SelectMoreTopicsComponent } from './../../popups/select-more-topics/select-more-topics.component';
import { PostServiceService } from './../../service/post-service/post-service.service';
import { FollowServiceService } from './../../service/follow-service/follow-service.service';

import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';

import { CreatTopicComponent } from './../../popups/creat-topic/creat-topic.component';

const uriImage = 'http://localhost:3000/API/FileUpload/UploadImage';

const uriVideo = 'http://localhost:3000/API/FileUpload/UploadVideo';


@Component({
  selector: 'app-post-two',
  templateUrl: './post-two.component.html',
  styleUrls: ['./post-two.component.css']
})
export class PostTwoComponent implements OnInit {

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';

  ActiveIndex: number;
  UserInfo: any;
  PostForm: FormGroup;
  ImageInputActive: Boolean = false;
  VideoInputActive: Boolean = false;
  LinkInputActive: Boolean = false;
  Topics;

  ImagesList: any[] = [];
  VideosList: any[] = [];

  ImageUploadErrorMessage: string;
  ImageAllowedType = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg'];
  MaxImageFileSize = 10485760; // 10mp
  Imageuploader: FileUploader = new FileUploader({
                              url: uriImage,
                              disableMultipart: false,
                              allowedMimeType: this.ImageAllowedType,
                              autoUpload: false,
                              maxFileSize: this.MaxImageFileSize});


  VideoUploadErrorMessage: string;
  VideoAllowedType = ['video/mp4', 'video/3gp', 'video/flv', 'video/mkv', 'video/avi'];
  MaxVideoFileSize = 104857600; // 100mp
  Videouploader: FileUploader = new FileUploader({
                                  url: uriVideo,
                                  disableMultipart: false,
                                  allowedMimeType: this.VideoAllowedType,
                                  autoUpload: false,
                                  maxFileSize: this.MaxVideoFileSize});

  constructor(
    private Service: PostServiceService,
    private FolowService: FollowServiceService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PostTwoComponent>,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: any ) {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

        this.FolowService.FollowingTopics(this.UserInfo.data._id).subscribe(results => this.Topics = results['data'] );
        // Image Upload
            this.Imageuploader.onBuildItemForm = (fileItem, form) => {
              form.append('UserId', this.UserInfo.data._id);
              return {fileItem, form};
            };
            this.Imageuploader.onWhenAddingFileFailed = (item: any, filter: any, options: any) => {
              switch (filter.name) {
                case 'fileSize':
                    this.ImageUploadErrorMessage = `Maximum upload size exceeded (${item.size} of ${this.MaxImageFileSize} allowed)`;
                    break;
                case 'mimeType':
                    const allowedTypes = this.ImageAllowedType.join();
                    this.ImageUploadErrorMessage = `Type '${item.type} is not allowed. Allowed types: '${allowedTypes}'`;
                    break;
                default:
                    this.ImageUploadErrorMessage = `Unknown error (filter is ${filter.name})`;
              }
              alert(this.ImageUploadErrorMessage);
            };
            this.Imageuploader.onCompleteItem = (item: any, response: any, status: any, headers: any ) => {
              if (JSON.parse(response).status === 'True') {
                item.formData.push(JSON.parse(response).data);
              }
            };


        // Video Upload
            this.Videouploader.onBuildItemForm = (fileItem, form) => {
              form.append('UserId', this.UserInfo.data._id);
              return {fileItem, form};
            };
            this.Videouploader.onWhenAddingFileFailed = (item: any, filter: any, options: any) => {
              switch (filter.name) {
                case 'fileSize':
                    this.VideoUploadErrorMessage = `Maximum upload size exceeded (${item.size} of ${this.MaxImageFileSize} allowed)`;
                    break;
                case 'mimeType':
                    const allowedTypes = this.ImageAllowedType.join();
                    this.VideoUploadErrorMessage = `Type '${item.type} is not allowed. Allowed types: '${allowedTypes}'`;
                    break;
                default:
                    this.VideoUploadErrorMessage = `Unknown error (filter is ${filter.name})`;
              }
              alert(this.VideoUploadErrorMessage);
            };

            this.Videouploader.onCompleteItem = (item: any, response: any, status: any, headers: any ) => {
              if  (JSON.parse(response).status === 'True') {
                item.formData.push(JSON.parse(response).data);
              }
            };
      }

  ngOnInit() {
    this.PostForm = new FormGroup({
      UserId: new FormControl(this.UserInfo.data._id, Validators.required),
      PostTopicId: new FormControl('',  Validators.required),
      PostTopicName: new FormControl('',  Validators.required),
      PostDate: new FormControl(new Date(), Validators.required),
      PostText: new FormControl(''),
      PostLink: new FormControl(''),
      PostImage: new FormControl(''),
      PostVideo: new FormControl('')
    });

  }


  OpenModelMoreTopics() {
    const SelectMoreTopicDialogRef = this.dialog.open(
      SelectMoreTopicsComponent, {disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { Header: 'Select More Topics'} }
    );
    SelectMoreTopicDialogRef.afterClosed().subscribe(result => this.SelectMoreTopicClose(result));
  }


  SelectMoreTopicClose(result) {
    if (result === 'Close') {
      this.snackBar.open( 'Following Topics Closed', ' ', {
        horizontalPosition: 'center',
        duration: 3000,
        verticalPosition: 'top',
      });
    }else {
      const selectedindex = this.Topics.findIndex(topic => topic._id === result._id);
      if (selectedindex >= 0 &&  selectedindex < 6 ) {
        this.ActiveTopicSelect(selectedindex);
      }else {
        this.Topics.splice(0, 0, result);
        this.ActiveIndex = 0;
        this.PostForm.controls['PostTopicId'].setValue(this.Topics[0]._id);
        this.PostForm.controls['PostTopicName'].setValue(this.Topics[0].TopicName);
      }

    }
  }

  OpenModelCreatTopic() {
    const CreatTopictDialogRef = this.dialog.open(
      CreatTopicComponent, {disableClose: true, maxWidth: '99%', position: {top: '50px'},  data: { PostId: '' } }
    );
    CreatTopictDialogRef.afterClosed().subscribe(result => this.DiscoverClose(result));
  }

  DiscoverClose(result) {
    if (result === 'Created') {
      this.FolowService.FollowingTopics(this.UserInfo.data._id).subscribe(results => this.Topics = results['data'] );
      this.snackBar.open( 'Your New Topic Successfully Created', ' ', {
        horizontalPosition: 'center',
        duration: 3000,
        verticalPosition: 'top',
      });
    }else {
      this.snackBar.open( 'Topic Creat Form Closed', ' ', {
        horizontalPosition: 'center',
        duration: 3000,
        verticalPosition: 'top',
      });
    }
  }

  ActiveTopicSelect(index: number) {
    if  (this.ActiveIndex !== index) {
      this.ActiveIndex = index;

      this.PostForm.controls['PostTopicId'].setValue(this.Topics[index]._id);
      this.PostForm.controls['PostTopicName'].setValue(this.Topics[index].TopicName);
    }
  }

  ImageInputActiveToggle() {
    this.ImageInputActive = !this.ImageInputActive;
  }

  VideoInputActiveToggle() {
    this.VideoInputActive = !this.VideoInputActive;
  }

  LinkInputActiveToggle() {
    this.LinkInputActive = !this.LinkInputActive;
  }

  submit() {
    if  (this.ActiveIndex >= 0 ) {
      if  (this.VideoInputActive) {
        const VideoQueue = this.Videouploader.queue;
          for ( var i in VideoQueue) {
            if  (VideoQueue[i].isUploaded) {
              const QueueItemId = VideoQueue[i].formData[0]._id;
              const QueueItemName = VideoQueue[i].formData[0].FileName;
              this.VideosList.push({'VideoId': QueueItemId, 'VideoName': QueueItemName});
            }
          }
          if (this.VideosList.length > 0 ) {
            this.PostForm.controls['PostVideo'].setValue(this.VideosList);
          }
      }
      if  (this.ImageInputActive) {
        const ImageQueue = this.Imageuploader.queue;
          for ( var i in ImageQueue) {
            if  (ImageQueue[i].isUploaded) {
              const QueueItemId = ImageQueue[i].formData[0]._id;
              const QueueItemName = ImageQueue[i].formData[0].FileName;
              this.ImagesList.push({'ImageId': QueueItemId, 'ImageName': QueueItemName});
            }
          }
          if (this.ImagesList.length > 0 ) {
            this.PostForm.controls['PostImage'].setValue(this.ImagesList);
          }
      }
      this.Service.QuestionsSubmit(this.PostForm.value).subscribe(datas => this.ValidateData(datas));
    }else {
      alert('Select Any One Topic.');
    }

  }

  ValidateData(datas) {
    if  (datas.status) {
      this.dialogRef.close(datas.data);
    }else {
      console.log(datas);
      this.dialogRef.close('Close');
    }
  }
  close() {
    this.dialogRef.close('Close');
  }


}
