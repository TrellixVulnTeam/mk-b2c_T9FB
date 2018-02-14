import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { FollowServiceService } from './../../service/follow-service/follow-service.service';
import { PostThreeComponent } from './../../popups/post-three/post-three.component';
import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';
import { TrendsService } from './../../service/trends-service/trends.service';

@Component({
  selector: 'app-feeds-trends',
  templateUrl: './feeds-trends.component.html',
  styleUrls: ['./feeds-trends.component.css']
})
export class FeedsTrendsComponent implements OnInit {

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';

  scrollHeight;
  impresionsHeight;
  screenHeight: number;
  impresionscreenHeight: number;
  anotherHeight: number;
  PredictionAddButton: Boolean = true;

  UserInfo;
  ListOfCoins;
  ActiveCoin = 0;
  CoinListLoader: Boolean = true;
  ListOfImpressions: Array<object> = new Array();
  ImpressionsListLoader: Boolean = true;
  ChartLoader: Boolean = true;
  Info: any[] = [];
  Prediction: any[] = [];

  lineChartData: Array<any> = [];
  lineChartLabels: Array<any> = [];
  lineChartLegend: Boolean = false;
  lineChartType: String = 'line';
  lineChartOptions: any = { responsive: true };

  lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(255, 217, 0, 0.3)',
      borderColor: 'rgba(255, 217, 0, 1)',
      pointBackgroundColor: 'rgba(230, 176, 0, 1)',
      pointBorderColor: 'rgba(230, 176, 0, 1)',
      pointHoverBackgroundColor: 'rgba(230, 176, 0, 0.5)',
      pointHoverBorderColor: 'rgba(230, 176, 0, 0.5)'
    }
  ];

  constructor(private router: Router,
    private FollowService: FollowServiceService,
    private ShareService: DataSharedVarServiceService,
    public dialog: MatDialog,
    private trendsService: TrendsService
  ) {
    this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

    this.trendsService.CoinsList(this.UserInfo.data._id)
      .subscribe( datas => {
          if (datas['status'] === 'True') {
            this.ListOfCoins = datas['data'];
            this.CoinListLoader = false;
            this.ListOfCoins = this.ListOfCoins.sort((a, b) => a.Rate - b.Rate ).reverse();
            this.Info = this.ListOfCoins[this.ActiveCoin];

            this.trendsService.ImpressionPosts( this.ListOfCoins[this.ActiveCoin].CoinId, this.UserInfo.data._id)
              .subscribe( posts => {
                  if (posts['status'] === 'True') {
                    this.ListOfImpressions = posts['data'];
                    this.ImpressionsListLoader = false;
                  }else {
                    this.ImpressionsListLoader = false;
                    console.log(posts);
                  }
              });

              this.trendsService.GetPrediction( this.ListOfCoins[this.ActiveCoin].CoinId, this.UserInfo.data._id)
              .subscribe( data => {
                  if (data['status'] === 'True') {
                    this.Prediction = data['data'];
                  }else {
                    console.log(data);
                  }
              });

              this.trendsService.ChartInfo( this.ListOfCoins[this.ActiveCoin].Code)
              .subscribe( posts => {
                  if (posts['status'] === 'True') {
                    this.lineChartData = posts['data'].Values;
                    this.lineChartLabels =  posts['data'].Dates;
                    this.ChartLoader = false;
                  }else {
                    this.ChartLoader = false;
                    console.log(posts);
                  }
              });

          }else {
            this.CoinListLoader = false;
            console.log(datas);
          }
      });

   }





  chartClicked(e: any): void {
      console.log(e);
    }

  chartHovered(e: any): void {
      console.log(e);
    }






  ngOnInit() {
    this.screenHeight = window.innerHeight - 125;
    this.impresionscreenHeight = window.innerHeight - 600;
    this.scrollHeight = this.screenHeight + 'px';
    this.impresionsHeight = this.impresionscreenHeight + 'px';
  }

  ChangeActiveCoin(id) {
    if (this.ActiveCoin !== id ) {
      this.ActiveCoin = id;
      this.ListOfImpressions = [];
      this.ImpressionsListLoader = true;
      this.Info = this.ListOfCoins[this.ActiveCoin];
      this.PredictionAddButton = true;

      this.trendsService.ImpressionPosts( this.ListOfCoins[this.ActiveCoin].CoinId, this.UserInfo.data._id)
          .subscribe( posts => {
              if (posts['status'] === 'True') {
                this.ListOfImpressions = posts['data'];
                this.ImpressionsListLoader = false;
              }else {
                this.ImpressionsListLoader = false;
                console.log(posts);
              }
          });

      this.trendsService.GetPrediction( this.ListOfCoins[this.ActiveCoin].CoinId, this.UserInfo.data._id)
          .subscribe( data => {
              if (data['status'] === 'True') {
                this.Prediction = data['data'];
                console.log(data);
              }else {
                console.log(data);
              }
          });

      this.trendsService.ChartInfo( this.ListOfCoins[this.ActiveCoin].Code)
          .subscribe( posts => {
              if (posts['status'] === 'True') {
                this.lineChartData = posts['data'].Values;
                this.lineChartLabels =  posts['data'].Dates;
                this.ChartLoader = false;
              }else {
                this.ChartLoader = false;
                console.log(posts);
              }
          });
    }
  }

  OpenModel() {
    const PostThreeDialogRef = this.dialog.open(PostThreeComponent, {
      disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { CoinId : this.ListOfCoins[this.ActiveCoin].CoinId } });
    PostThreeDialogRef.afterClosed().subscribe(result => this.GoToAnalize(result));
  }

  GoToAnalize(result) {
    if (result !== 'Close' && result.PostText !== '') {
        const data = {'UserId': this.UserInfo.data._id,
            'PostText': result.PostText,
            'CoinId':  this.ListOfCoins[this.ActiveCoin].CoinId,
            'PostDate':  new Date()
          };
        this.trendsService.ImpressionAdd(data).subscribe( datas => {
          if (datas['status'] === 'True' && !datas['message']) {

            if (this.ListOfImpressions === undefined) {
              const NewData = new Array();
                NewData.push(datas['data']);
                this.ListOfImpressions = NewData;
            }else {
              this.ListOfImpressions.splice(0, 0, datas['data']);
            }
          }else {
              console.log(datas);
          }
        });
    }
  }

  onTabChange(event) {
    console.log(event);
  }




  AddPrediction(value) {
    if (value !== '') {
    const data = {'UserId': this.UserInfo.data._id,
              'CoinId': this.Info['CoinId'],
              'CoinCode': this.Info['Code'],
              'CoinName':  this.Info['FullName'],
              'Value': value
            };

          this.PredictionAddButton = true;
          this.trendsService.PredictionAdd(data).subscribe( datas => {
            if (datas['status'] === 'True' && !datas['message']) {

              this.trendsService.GetPrediction( this.ListOfCoins[this.ActiveCoin].CoinId, this.UserInfo.data._id)
              .subscribe( newdata => {
                  if (newdata['status'] === 'True') {
                    this.Prediction = newdata['data'];
                  }else {
                    console.log(newdata);
                  }
              });
            }else {
                console.log(datas);
            }
          });
    }
  }



  GotoProfile(Id) {
    this.ShareService.SetProfilePage(Id);
    this.router.navigate(['ViewProfile']);
  }


  followUser(Id: String, index) {
    const data =  { 'UserId' : this.UserInfo.data._id, 'FollowingUserId' : Id };
      this.FollowService.FollowUser(data)
        .subscribe( datas => {
          if (datas.status === 'True') {
            this.ListOfImpressions[index]['AlreadyFollow'] = true;
          }else {
            console.log(datas);
          }
      });
  }

}
