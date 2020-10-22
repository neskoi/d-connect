exports.ramdom = function (min_value, max_value){
  let number = Math.floor((Math.random() * (max_value - min_value)) + min_value);
  if(number == 0){
    number++;
  }
  return number;
  }
