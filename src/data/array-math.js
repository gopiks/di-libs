/* functions for 1D array multiplication.. will fail if the array is not array of numbers */
(()=>{
Array.prototype.mean =function(){
	var sum=this.reduce((a, b) => a + b, 0);
	return sum/this.length;
};


Array.prototype.sum =function(){
	return this.reduce((a, b) => a + b, 0);
	
};

Array.prototype.max =function(){
	return this.reduce((a, b) => Math.max(a , b), this[0]);
	
};


Array.prototype.min =function(){
	return this.reduce((a, b) => Math.min(a , b), this[0]);
	
};

Array.prototype.scale =function(type){
	if(type=='min-max'){
		min=this.min();
		max=this.max();
		
		return this.map(x => (x-min)/(max-min));
	}
	
	if(type=='returns'){

		
		return this.map(x =>x/this[0]-1);
	}
	if(type=='standardize'){
		var mean=this.mean();
		var stdev=this.stdev();
		return this.map(x =>(x-mean)/stdev);
	}
	
};


Array.prototype.mult = function(other){
	if(typeof(other)=='number') 
		return this.map(x=>x*other);
	if(Array.isArray(other)){
	    var result=[];
	    for(var i=0;i<this.length;i+=1) result.push(this[i]*other[i]);
	    return result;
	}
};

Array.prototype.add = function(other){
	if(typeof(other)=='number') 
		return this.map(x=>x+other);
	if(Array.isArray(other)){
	    var result=[];
	    for(var i=0;i<this.length;i+=1) result.push(this[i]+other[i]);
	    return result;
	}
	     
};

Array.prototype.divide = function(other){
	if(typeof(other)=='number') 
		return this.map(x=>x/other);
	if(Array.isArray(other)){
	    var result=[];
	    for(var i=0;i<this.length;i+=1) result.push(this[i]/other[i]);
	    return result;
	}
	     
};


Array.prototype.subtract = function(other){
	if(typeof(other)=='number') 
		return this.map(x=>x-other);
	if(Array.isArray(other)){
	    var result=[];
	    for(var i=0;i<this.length;i+=1) result.push(this[i]-other[i]);
	    return result;
	}
	     
};

Array.prototype.power = function(other){
	if(typeof(other)=='number') 
		return this.map(x=>x**other);
	if(Array.isArray(other)){
	    var result=[];
	    for(var i=0;i<this.length;i+=1) result.push(this[i]**other[i]);
	    return result;
	}
	     
};


Array.prototype.dot = function(other){
	return this.mult(other).sum();
};

Array.prototype.stdev =function(){
	var mean=this.mean();
	return Math.sqrt(this.map(b=> (b-mean)**2).mean());
	
};

Array.prototype.var =function(){
	var mean=this.mean();
	return this.map(b=> (b-mean)**2).mean();
	
};

Array.prototype.covar = function(other){
	
	return this.add(-this.mean()).dot(other.add(-other.mean()))/this.length;
};

Array.prototype.correl = function(other){
	return this.covar(other)/(this.stdev()*other.stdev());
};

Array.prototype.transpose = function(){
	var tr=[];
	var length=this.map(x=>x.length).max();
	for(var i =0;i<length;i++){
	    tr.push(this.map(x=>x[i]));
	    
	}
	return tr;
};


Array.prototype.shape=function(){
	return [this.length,this.map(x=>x.length||0).max()];
};

Array.prototype.mmult=function(other){
       var left_shape=this.shape;
       var right_shape=other.shape;
       if(left_shape[0]!=right_shape[1] || left_shape[1]!=right_shape[0]) throw("Dimension mismatch");
       
	
};


Array.prototype.hist=function(buckets){
	if(buckets==undefined) var buckets =this.length>30?30:this.length;
	var hist =[];
	var min=this.min();
	var max=this.max();
	var bucket_size=(max-min)/buckets;
	var lower=min;
	for(var i =0;i<buckets;i+=1){
		higher=lower+bucket_size;
		hist.push([lower,this.filter(x=>(x>=lower && x<=higher)).length]);
		lower=higher;
		
	}
	return hist;
}

Array.prototype.dist=function(buckets){
	if(buckets==undefined) var buckets =this.length>30?30:this.length;
	var hist =[];
	var min=this.min();
	var max=this.max();
	var bucket_size=(max-min)/buckets;
	var lower=min;
	for(var i =0;i<buckets;i+=1){
		higher=lower+bucket_size;
		hist.push([(lower+higher)/2,this.filter(x=>(x>=lower && x<=higher)).length/bucket_size/this.length]);
		lower=higher;
		
	}
	return hist;
}

Array.prototype.ma =function(window){

}

Grouper = function(groups,original_shape){

	this.groups=groups;

  this.shape=original_shape;
  this.agg= function(ag){
  	

		if(this.shape[1]==0) {
		  var result = { };

		  Object.keys(groups).forEach(key=> {
			result[key] = ag(groups[key]);
		  });
		  return result;
		}
		else if(this.shape[1]>0) {
		  var result = { };

		  Object.keys(groups).forEach(key=> {

			result[key] = groups[key].transpose().map(ag);
		  });
		  return result;
		}
	}
}

Array.prototype.groupby = function(by){
	if(by.length!=this.length) throw("By array and this array should have same length");
	var unique = by.filter((value, index, array) => array.indexOf(value) === index);
	var groups={};

	for(var i=0;i<by.length;i+=1){

		if(groups[by[i]] == undefined) groups[by[i]] = [];
	   groups[by[i]].push(this[i]);
	}
	var grouper = new Grouper(groups,this.shape());
	
	return grouper;
}

window.sum=x=>x.sum();
window.mean=x=>x.mean();
window.stdev=x=>x.stdev();
window.min=x=>x.min();
window.max=x=>x.max();
window.count=x=>x.length;

window.range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);


})();