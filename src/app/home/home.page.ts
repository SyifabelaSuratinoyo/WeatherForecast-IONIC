import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  weatherData: any;
  forecastData: any[] = [];
  city: string = 'Manado'; // Lokasi default
  errorMessage: string = '';
  isLoading: boolean = false;
  today: Date = new Date();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    setInterval(() => {
      this.today = new Date();
    }, 60000);

    this.searchWeather(); // Memanggil fungsi untuk mendapatkan cuaca saat halaman dimuat
  }

  searchWeather() {
    this.isLoading = true;

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=622d9c0e42384be9772bfcbfb442b3fc&units=metric`;

    this.http.get(apiUrl).subscribe(
      (data) => {
        this.weatherData = data;
        this.errorMessage = '';
        this.isLoading = false;
        this.today = new Date();
        this.getWeatherForecast(this.weatherData.coord.lat, this.weatherData.coord.lon);
      },
      (error) => {
        this.errorMessage = 'City not found';
        this.weatherData = null;
        this.forecastData = [];
        this.isLoading = false;
      }
    );
  }

  getWeatherForecast(lat: number, lon: number) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=622d9c0e42384be9772bfcbfb442b3fc&units=metric`;

    this.http.get(forecastApiUrl).subscribe(
      (data: any) => {
        this.forecastData = data.daily;
      },
      (error) => {
        console.error('Error fetching forecast data', error);
      }
    );
  }
}
