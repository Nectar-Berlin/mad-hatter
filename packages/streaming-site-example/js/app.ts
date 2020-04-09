import { WhiteRabbitClient } from '@whiterabbitjs/client';
import { utils } from '@whiterabbitjs/client';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
const notyf = new Notyf();
const client = new WhiteRabbitClient({ host: process.env.WR_WALLET_HOST });

const movies = [{
  id: '5247022',
  url: 'https://whiterabbit-trailer.s3.eu-central-1.amazonaws.com/Paterson_Official_Trailer_1_2016_-_Adam_Driver_Movie.mp4'
},
{
  id: '2933474',
  url: 'https://whiterabbit-trailer.s3.eu-central-1.amazonaws.com/Superfast_Official_Trailer_1_2015_-_Fast_and_Furious_Spoof_HD.mp4'
}];

Vue.directive('init-video', {
  bind: function(item) {
    setTimeout(() => {
      item.pause();
    },7000)
  }
});

new Vue({
    el: '#app',
    data: {
      videos: [],
      popup: {
        on:false,
        video:{}
      },
    },
    mounted: async function () {
      this.loadMovies();
    },
    methods: {
      getPopup: function (video) {
        this.initiateWallet(video.tokenId);
        this.popup.video = video;
        this.popup.on = true;
      },
      removePopup: function () {
        this.popup.on = false;
      },
      initiateWallet: async function (tokenId) {
        client.requestPayment(tokenId).then((result: { status: boolean }) => {
          if(result.status){
            notyf.success("Payment successful.")
          } else {
            notyf.error("Payment unsuccessful.")
          }
          const video: any = document.querySelector('.popup-inner video');
          if (video) video.play();
        });
      },
      loadMovies: async function () {
          try {
            this.videos = await Promise.all(movies.map(async function(movie){
              const movieDetails = await client.getMovieDetails(movie.id);
              return {
                ...movieDetails,
                video: movie.url,
                tokenId: utils.imdbToToken(movie.id)
              };
            }));
          } catch (e) {
            notyf.error(e);
          }
      }
    }
});
