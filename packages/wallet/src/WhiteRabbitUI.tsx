import { Page } from '@burner-wallet/ui-core';
import ModernUI from '@burner-wallet/modern-ui';

import MoviePage from './pages/MoviePage';

export default class WhiteRabbitUI extends ModernUI {
  
  getPages(): Page[] {
        return [
      ...super.getPages(),
      { path: '/movie/:tokenId', component: MoviePage },
    ];
  }
}
