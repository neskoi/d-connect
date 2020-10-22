class Background{
  constructor (backgrounds){
    this.backgrounds = backgrounds;
  }

  has_background(bkg){
    //return this.backgrounds.includes(element => element.name == bkg);
  }

}


module.exports = (backgrounds) => {
  return new Background(backgrounds);
}