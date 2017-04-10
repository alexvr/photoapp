import { PhotoappPage } from './app.po';

describe('photoapp App', function() {
  let page: PhotoappPage;

  beforeEach(() => {
    page = new PhotoappPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
