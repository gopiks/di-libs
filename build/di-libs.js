﻿/* functions for 1D array multiplication.. will fail if the array is not array of numbers */
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

const mult=function(left,other){
	if (Array.isArray(other)) return left.map((e,i) => mult(e , other[i]));
	if (Array.isArray(left)) 
		return left.map(x=>mult(x,other));
	else 
		return left*other;
	
}

Array.prototype.mult = function(other){
	return mult(this,other);
};

const add =function(left,other){
	if (Array.isArray(other)) return left.map((e,i) => add(e , other[i]));
	if (Array.isArray(left)) 
		return left.map(x=>add(x,other));
	else 
		return left+other;
	
}

Array.prototype.add = function(other){
	return add(this,other);
	     
};

const divide =function(left,other){
	if (Array.isArray(other)) return left.map((e,i) => divide(e , other[i]));
	if (Array.isArray(left)) 
		return left.map(x=>divide(x,other));
	else 
		return left/other;
	
}

Array.prototype.divide = function(other){
	return divide(this,other);
	     
};


const subtract =function(left,other){
	if (Array.isArray(other)) return left.map((e,i) => subtract(e , other[i]));
	if (Array.isArray(left)) 
		return left.map(x=>subtract(x,other));
	else 
		return left-other;
	
}

Array.prototype.subtract = function(other){
	return subtract(this,other);
	     
};


const power =function(left,other){
	if (Array.isArray(other)) return left.map((e,i) => power(e , other[i]));
	if (Array.isArray(left)) 
		return left.map(x=>power(x,other));
	else 
		return left**other;
	
}

Array.prototype.power = function(other){
	return power(this,other);
	     
};

const exp=function(x){
	return Array.isArray(x)?x.map(exp):Math.exp(x);
}
Array.prototype.exp = function(other){
	return exp(this);
	     
};

const log=function(x){
	return Array.isArray(x)?x.map(log):Math.log(x);
}
Array.prototype.log = function(other){
	return log(this);
	     
};

const square=function(x){
	return Array.isArray(x)?x.map(square):x*x;
}
Array.prototype.square = function(other){
	return square(this);
	     
};

const sqrt=function(x){
	return Array.isArray(x)?x.map(sqrt):Math.sqrt(x);
}
Array.prototype.sqrt = function(other){
	return sqrt(this);
	     
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



Array.prototype.cummsum=function(){
	var sum=0;
	return this.map((sum => value => sum += value)(0));
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


})();﻿/*
Array.to_dict(header=[],orient="records")
Dict.to_array(orient="records")
Array.to_csv(header=[])

*/

/*
Array.prototype.to_csv = function(header){
	if (header==undefined)
	 h="";
	else h=header.join(",")+"\n";
	
	csv=this.map(x=>x.join(",")).join("\n");
	
	return h+csv;

}

Array.prototype.from_csv= function(csv,start,header){
	lines=csv.split("\n");
	if(start!=undefined) lines.shift(start);
	if(header) {h=lines[0];lines.shift(1);}
	return {header:h,data:lines.map(l=>l.split(","))}
		
}

*/// Take dataframe as dataframejs or 2D array or X and Y as arrays
// Following plots:
// pie(X,Y, layout). 
// bar(labels,[Ys],layout)
// line([{x:,y:}],layout)
// scatter([{x:,y:}],layout)
//. Returns html.

(()=>{

Array.prototype.plot = function(type,dom,params){
  if(params == undefined) params ={};
  if(dom==undefined) var dom = curr_cell();
  if(type==undefined) var type='line';
  if(typeof(dom)=='string') dom = document.getElementById(dom);
  
  new_div=document.createElement("div");
  new_div.id='plot_'+(Math.random() + 1).toString(36).substring(7);
  
  dom.appendChild(new_div);
  
 
  
  if(type=='line' || type=='bar' ){
  	var name=params['name'] || String(params['names']);
  	var shape=this.shape();
  	if(shape[1]==2 && shape[0]>2) return this.transpose().plot(type,dom,params);
  	if(shape[1]>1 && shape[0]>1)
		var data=this.map(ln=>({y:ln,'type':type,name:name}));
	else
		var data=[{"y":this,type:type,name:name}];
	
	Plotly.newPlot(new_div, data,params['layout']);
	
  }
  if(type=='multi-line' || type=='multi-bar'){
  
  	var data=[];
  	
  	var names=params['names'] || [];
  	
	
  	this.forEach(l=>{
  		var shape=l.shape();
  		if(shape[0]>1 && shape[1]>1)
  		 	data.push({"y":l[1],x:l[0],type:type.replace("multi-",""),name:names.shift()});
  		else
  		 	data.push({"y":l[1],x:l[0],type:type.replace("multi-",""),name:names.shift()});
		
	});
	Plotly.newPlot(new_div, data,params['layout']);

  }
  if(type=='scatter'){
  	var shape=this.shape();
  	if(shape[1]==2 && shape[0]>2) return this.transpose().plot(type,dom,params);
  	if(shape[0]<=1 || shape[1] <= 1) throw("Need two arrays for scatter");
    	var name=params['name'] || String(params['names']);
	var data=[{y:this[1],x:this[0],type:type,name:name}];
	
	Plotly.newPlot(new_div, data,params['layout']);
  
  }
  if(type=='multi-scatter'){
    	var data=[];

  	var names=params['names'] || [];  	
	
  	this.forEach(l=>{
  		if(names!=undefined && names.length>0)
			data.push({y:l[1],x:l[0],type:'scatter',name:names.shift()});
		else
			data.push({y:l[1],x:l[0],type:'scatter'});
	});
	Plotly.newPlot(new_div, data,params['layout']);
  
  }
  if(type=='contour'){
  	var shape=this.shape();
  	if(shape[1]==3 && shape[0]>3) return this.transpose().plot(type,dom,params);
  	if(shape[0] != 3) throw("Need three arrays for contour");
    	var name=params['name'] || String(params['names']) || "Contour";
	var data=[{y:this[1],x:this[0],z:this[2],type:type,name:name}];
	
	Plotly.newPlot(new_div, data,params['layout']);
  
  }
  new_div.classList.add('di-plot');
  return new_div.id;  
}


Array.prototype.to_html = function(columns,index){
	var thead="";
	var tbody="<tbody>";
	var shape=this.shape();
	if(shape[1]==0) throw("Not a 2d Array");
	if(columns!=undefined && columns.length==shape[1]) 
	  thead="<thead><tr><th></th>"+columns.map(x=>"<th>"+x+"</th>").join("")+"</tr></thead>"
	if(index==undefined) var index=this.map(row=>"<th>"+"</th>");
	else {
		if(index.length!=shape[0]) throw("Index is not same length as the data");
		else index=index.map(idx=>"<th>"+idx+"</th>");
	}
	this.forEach(row=>{
		tbody+="<tr>"+index.shift()+row.map(val=>"<td>"+val+"</td>").join("")+"</tr>"
	});
	tbody+="</tbody>";
	return "<table class='di-table'>"+thead+tbody+"</table>";
	
}



})();



var normalcdf=function(X){   //HASTINGS.  MAX ERROR = .000001
	var T=1/(1+.2316419*Math.abs(X));
	var D=.3989423*Math.exp(-X*X/2);
	var Prob=D*T*(.3193815+T*(-.3565638+T*(1.781478+T*(-1.821256+T*1.330274))));
	if (X>0) {
		Prob=1-Prob
	}
	return Prob
}   

var ndist=function(z) {
  return (1.0/(Math.sqrt(2*Math.PI)))*Math.exp(-0.5*z);
  //??  Math.exp(-0.5*z*z)
}

var black_scholes = {};

black_scholes.call_price=function(S,K,r,v,t) { 
  var sqt = Math.sqrt(t);
  d1 = (Math.log(S/K) + r*t)/(v*sqt) + 0.5*(v*sqt);
  d2 = d1 - (v*sqt);
  delta = normalcdf(d1);
  Nd2 = normalcdf(d2);
  ert = Math.exp(-r*t);
  nd1 = ndist(d1);
  result={}
  result['price']=S*delta-K*ert *Nd2;
  result['gamma'] = nd1/(S*v*sqt);
  result['vega'] = S*sqt*nd1;
  result['theta'] = -(S*v*nd1)/(2*sqt) - r*K*ert*Nd2;
  result['rho'] = K*t*ert*Nd2;
  return (result );
} //end of black_scholes call

black_scholes.put_price=function(S,K,r,v,t) { 
  var sqt = Math.sqrt(t);
  d1 = (Math.log(S/K) + r*t)/(v*sqt) + 0.5*(v*sqt);
  d2 = d1 - (v*sqt); 
  delta = normalcdf(d1)-1;
  Nd2 = -normalcdf(-d2); 
  ert = Math.exp(-r*t);
  nd1 = ndist(d1);
  result={}
  result['price']=S*delta-K*ert *Nd2;
  result['gamma'] = nd1/(S*v*sqt);
  result['vega'] = S*sqt*nd1;
  result['theta'] = -(S*v*nd1)/(2*sqt) - r*K*ert*Nd2;
  result['rho'] = K*t*ert*Nd2; 
  return ( result);
 
} //end of black_scholes put

black_scholes.option_price=function(option_type,S,K,r,v,t){
	if (option_type == 'CE' || option_type == 'Call' || option_type == 'C'){
		return black_scholes.call_price(S,K,r,v,t);
	}else if (option_type == 'PE' || option_type == 'Put' || option_type == 'P'){
		return black_scholes.put_price(S,K,r,v,t);
	}
}

black_scholes.IV=function(option_type,S,K,r,t,P){
	upper_bound=2;
	lower_bound=0;
	p_estimate=option_price(option_type,S,K,r,(lower_bound+upper_bound)/2.0,t)['price'];
	while (Math.abs(upper_bound-lower_bound)>0.000001){
		p_estimate=option_price(option_type,S,K,r,(lower_bound+upper_bound)/2.0,t)['price'];
		if (p_estimate<P) lower_bound=(lower_bound+upper_bound)/2.0;
		else if (p_estimate>P) upper_bound=(lower_bound+upper_bound)/2.0;
	}
	return (lower_bound+upper_bound)/2.0;
}

if(window!=undefined)
	window.black_scholes=black_scholes;
/*!
 * Forked and modified from https://github.com/jseidelin/pixastic
 * 
 *
 */
 
 
PicEffects = (function() {

    function defaultOptions(options, defaults) {
        var O = {};
        for (var opt in defaults) {
            if (typeof options[opt] == "undefined") {
                O[opt] = defaults[opt];
            } else {
                O[opt] = options[opt];
            }
        }
        return O;
    }

    function clamp(val, min, max) {
        return Math.min(max, Math.max(min, val));
    }

    function convolve3x3(inData, outData, width, height, kernel, progress, alpha, invert, mono) {
        var idx, r, g, b, a,
            pyc, pyp, pyn,
            pxc, pxp, pxn,
            x, y,
            
            prog, lastProg = 0,
            n = width * height * 4,
            
            k00 = kernel[0][0], k01 = kernel[0][1], k02 = kernel[0][2],
            k10 = kernel[1][0], k11 = kernel[1][1], k12 = kernel[1][2],
            k20 = kernel[2][0], k21 = kernel[2][1], k22 = kernel[2][2],
            
            p00, p01, p02,
            p10, p11, p12,
            p20, p21, p22;
            
        for (y=0;y<height;++y) {
            pyc = y * width * 4;
            pyp = pyc - width * 4;
            pyn = pyc + width * 4;

            if (y < 1) pyp = pyc;
            if (y >= width-1) pyn = pyc;
            
            for (x=0;x<width;++x) {
                idx = (y * width + x) * 4;
                
                pxc = x * 4;
                pxp = pxc - 4;
                pxn = pxc + 4;
          
                if (x < 1) pxp = pxc;
                if (x >= width-1) pxn = pxc;
                
                p00 = pyp + pxp;    p01 = pyp + pxc;    p02 = pyp + pxn;
                p10 = pyc + pxp;    p11 = pyc + pxc;    p12 = pyc + pxn;
                p20 = pyn + pxp;    p21 = pyn + pxc;    p22 = pyn + pxn;

                r = inData[p00] * k00 + inData[p01] * k01 + inData[p02] * k02
                  + inData[p10] * k10 + inData[p11] * k11 + inData[p12] * k12
                  + inData[p20] * k20 + inData[p21] * k21 + inData[p22] * k22;

                g = inData[p00 + 1] * k00 + inData[p01 + 1] * k01 + inData[p02 + 1] * k02
                  + inData[p10 + 1] * k10 + inData[p11 + 1] * k11 + inData[p12 + 1] * k12
                  + inData[p20 + 1] * k20 + inData[p21 + 1] * k21 + inData[p22 + 1] * k22;
                  
                b = inData[p00 + 2] * k00 + inData[p01 + 2] * k01 + inData[p02 + 2] * k02
                  + inData[p10 + 2] * k10 + inData[p11 + 2] * k11 + inData[p12 + 2] * k12
                  + inData[p20 + 2] * k20 + inData[p21 + 2] * k21 + inData[p22 + 2] * k22;

                if (alpha) {
                    a = inData[p00 + 3] * k00 + inData[p01 + 3] * k01 + inData[p02 + 3] * k02
                      + inData[p10 + 3] * k10 + inData[p11 + 3] * k11 + inData[p12 + 3] * k12
                      + inData[p20 + 3] * k20 + inData[p21 + 3] * k21 + inData[p22 + 3] * k22;
                } else {
                    a = inData[idx+3];
                }

                if (mono) {
                    r = g = b = (r + g + b) / 3;
                }
                if (invert) {
                    r = 255 - r;
                    g = 255 - g;
                    b = 255 - b;
                }
                
                outData[idx] = r;
                outData[idx+1] = g;
                outData[idx+2] = b;
                outData[idx+3] = a;
                
                if (progress) {
                    prog = (idx/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        }
    }
    
    function convolve5x5(inData, outData, width, height, kernel, progress, alpha, invert, mono) {
        var idx, r, g, b, a,
            pyc, pyp, pyn, pypp, pynn,
            pxc, pxp, pxn, pxpp, pxnn,
            x, y,
            
            prog, lastProg = 0,
            n = width * height * 4,
            
            k00 = kernel[0][0], k01 = kernel[0][1], k02 = kernel[0][2], k03 = kernel[0][3], k04 = kernel[0][4],
            k10 = kernel[1][0], k11 = kernel[1][1], k12 = kernel[1][2], k13 = kernel[1][3], k14 = kernel[1][4],
            k20 = kernel[2][0], k21 = kernel[2][1], k22 = kernel[2][2], k23 = kernel[2][3], k24 = kernel[2][4],
            k30 = kernel[3][0], k31 = kernel[3][1], k32 = kernel[3][2], k33 = kernel[3][3], k34 = kernel[3][4],
            k40 = kernel[4][0], k41 = kernel[4][1], k42 = kernel[4][2], k43 = kernel[4][3], k44 = kernel[4][4],
            
            p00, p01, p02, p03, p04,
            p10, p11, p12, p13, p14,
            p20, p21, p22, p23, p24,
            p30, p31, p32, p33, p34,
            p40, p41, p42, p43, p44;
            
        for (y=0;y<height;++y) {
            pyc = y * width * 4;
            pyp = pyc - width * 4;
            pypp = pyc - width * 4 * 2;
            pyn = pyc + width * 4;
            pynn = pyc + width * 4 * 2;

            if (y < 1) pyp = pyc;
            if (y >= width-1) pyn = pyc;
            if (y < 2) pypp = pyp;
            if (y >= width-2) pynn = pyn;
            
            for (x=0;x<width;++x) {
                idx = (y * width + x) * 4;
                
                pxc = x * 4;
                pxp = pxc - 4;
                pxn = pxc + 4;
                pxpp = pxc - 8;
                pxnn = pxc + 8;
          
                if (x < 1) pxp = pxc;
                if (x >= width-1) pxn = pxc;
                if (x < 2) pxpp = pxp;
                if (x >= width-2) pxnn = pxn;
                
                p00 = pypp + pxpp;    p01 = pypp + pxp;    p02 = pypp + pxc;    p03 = pypp + pxn;    p04 = pypp + pxnn;
                p10 = pyp  + pxpp;    p11 = pyp  + pxp;    p12 = pyp  + pxc;    p13 = pyp  + pxn;    p14 = pyp  + pxnn;
                p20 = pyc  + pxpp;    p21 = pyc  + pxp;    p22 = pyc  + pxc;    p23 = pyc  + pxn;    p24 = pyc  + pxnn;
                p30 = pyn  + pxpp;    p31 = pyn  + pxp;    p32 = pyn  + pxc;    p33 = pyn  + pxn;    p34 = pyn  + pxnn;
                p40 = pynn + pxpp;    p41 = pynn + pxp;    p42 = pynn + pxc;    p43 = pynn + pxn;    p44 = pynn + pxnn;

                r = inData[p00] * k00 + inData[p01] * k01 + inData[p02] * k02 + inData[p03] * k04 + inData[p02] * k04
                  + inData[p10] * k10 + inData[p11] * k11 + inData[p12] * k12 + inData[p13] * k14 + inData[p12] * k14
                  + inData[p20] * k20 + inData[p21] * k21 + inData[p22] * k22 + inData[p23] * k24 + inData[p22] * k24
                  + inData[p30] * k30 + inData[p31] * k31 + inData[p32] * k32 + inData[p33] * k34 + inData[p32] * k34
                  + inData[p40] * k40 + inData[p41] * k41 + inData[p42] * k42 + inData[p43] * k44 + inData[p42] * k44;
                  
                g = inData[p00+1] * k00 + inData[p01+1] * k01 + inData[p02+1] * k02 + inData[p03+1] * k04 + inData[p02+1] * k04
                  + inData[p10+1] * k10 + inData[p11+1] * k11 + inData[p12+1] * k12 + inData[p13+1] * k14 + inData[p12+1] * k14
                  + inData[p20+1] * k20 + inData[p21+1] * k21 + inData[p22+1] * k22 + inData[p23+1] * k24 + inData[p22+1] * k24
                  + inData[p30+1] * k30 + inData[p31+1] * k31 + inData[p32+1] * k32 + inData[p33+1] * k34 + inData[p32+1] * k34
                  + inData[p40+1] * k40 + inData[p41+1] * k41 + inData[p42+1] * k42 + inData[p43+1] * k44 + inData[p42+1] * k44;
                  
                b = inData[p00+2] * k00 + inData[p01+2] * k01 + inData[p02+2] * k02 + inData[p03+2] * k04 + inData[p02+2] * k04
                  + inData[p10+2] * k10 + inData[p11+2] * k11 + inData[p12+2] * k12 + inData[p13+2] * k14 + inData[p12+2] * k14
                  + inData[p20+2] * k20 + inData[p21+2] * k21 + inData[p22+2] * k22 + inData[p23+2] * k24 + inData[p22+2] * k24
                  + inData[p30+2] * k30 + inData[p31+2] * k31 + inData[p32+2] * k32 + inData[p33+2] * k34 + inData[p32+2] * k34
                  + inData[p40+2] * k40 + inData[p41+2] * k41 + inData[p42+2] * k42 + inData[p43+2] * k44 + inData[p42+2] * k44;

                if (alpha) {
                    a = inData[p00+3] * k00 + inData[p01+3] * k01 + inData[p02+3] * k02 + inData[p03+3] * k04 + inData[p02+3] * k04
                      + inData[p10+3] * k10 + inData[p11+3] * k11 + inData[p12+3] * k12 + inData[p13+3] * k14 + inData[p12+3] * k14
                      + inData[p20+3] * k20 + inData[p21+3] * k21 + inData[p22+3] * k22 + inData[p23+3] * k24 + inData[p22+3] * k24
                      + inData[p30+3] * k30 + inData[p31+3] * k31 + inData[p32+3] * k32 + inData[p33+3] * k34 + inData[p32+3] * k34
                      + inData[p40+3] * k40 + inData[p41+3] * k41 + inData[p42+3] * k42 + inData[p43+3] * k44 + inData[p42+3] * k44;
                } else {
                    a = inData[idx+3];
                }

                if (mono) {
                    r = g = b = (r + g + b) / 3;
                }
                
                if (invert) {
                    r = 255 - r;
                    g = 255 - g;
                    b = 255 - b;
                }
                
                outData[idx] = r;
                outData[idx+1] = g;
                outData[idx+2] = b;
                outData[idx+3] = a;
                
                if (progress) {
                    prog = (idx/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        }
    }
    
    function gaussian(inData, outData, width, height, kernelSize, progress) {
        var r, g, b, a, idx,
            n = width * height * 4,
            x, y, i, j, 
            inx, iny, w,
            tmpData = [],
            maxKernelSize = 13,
            kernelSize = clamp(kernelSize, 3, maxKernelSize),
            k1 = -kernelSize / 2 + (kernelSize % 2 ? 0.5 : 0),
            k2 = kernelSize + k1,
            weights,
            kernels = [[1]],
            prog, lastProg = 0;
            
            
        for (i=1;i<maxKernelSize;++i) {
            kernels[0][i] = 0;
        }
        
        for (i=1;i<maxKernelSize;++i) {
            kernels[i] = [1];
            for (j=1;j<maxKernelSize;++j) {
                kernels[i][j] = kernels[i-1][j] + kernels[i-1][j-1];
            }
        }

        weights = kernels[kernelSize - 1]
        
        for (i=0,w=0;i<kernelSize;++i) {
            w += weights[i];
        }
        for (i=0;i<kernelSize;++i) {
            weights[i] /= w;
        }
        
        // pass 1
        for (y=0;y<height;++y) {
            for (x=0;x<width;++x) {
                r = g = b = a = 0;

                for (i=k1;i<k2;++i) {
                    inx = x + i;
                    iny = y;
                    w = weights[i - k1];
                    
                    if (inx < 0) {
                        inx = 0;
                    }
                    if (inx >= width) {
                        inx = width - 1;
                    }
                    
                    idx = (iny * width + inx) * 4;

                    r += inData[idx] * w;
                    g += inData[idx + 1] * w;
                    b += inData[idx + 2] * w;
                    a += inData[idx + 3] * w;

                }
                
                idx = (y * width + x) * 4;
                
                tmpData[idx] = r;
                tmpData[idx+1] = g;
                tmpData[idx+2] = b;
                tmpData[idx+3] = a;
                
                if (progress) {
                    prog = (idx/n*50 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        }
        
        lastProg = 0;
        
        // pass 2
        for (y=0;y<height;++y) {
            for (x=0;x<width;++x) {
                r = g = b = a = 0;

                for (i=k1;i<k2;++i) {
                    inx = x;
                    iny = y + i;
                    w = weights[i - k1];
                    
                    if (iny < 0) {
                        iny = 0;
                    }
                    if (iny >= height) {
                        iny = height - 1;
                    }
                    
                    idx = (iny * width + inx) * 4;
                    
                    r += tmpData[idx] * w;
                    g += tmpData[idx + 1] * w;
                    b += tmpData[idx + 2] * w;
                    a += tmpData[idx + 3] * w;
                }
                
                idx = (y * width + x) * 4;
                
                outData[idx] = r;
                outData[idx+1] = g;
                outData[idx+2] = b;
                outData[idx+3] = a;
                
                if (progress) {
                    prog = 0.5 + (idx/n*50 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        }
    }
    
    
    return {

        invert : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                prog, lastProg = 0;

            for (i=0;i<n;i+=4) {
                outData[i] = 255 - inData[i];
                outData[i+1] = 255 - inData[i+1];
                outData[i+2] = 255 - inData[i+2];
                outData[i+3] = inData[i+3];

                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        sepia : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                prog, lastProg = 0,
                r, g, b;

            for (var i=0;i<n;i+=4) {
                r = inData[i];
                g = inData[i+1];
                b = inData[i+2];
                outData[i] = (r * 0.393 + g * 0.769 + b * 0.189);
                outData[i+1] = (r * 0.349 + g * 0.686 + b * 0.168);
                outData[i+2] = (r * 0.272 + g * 0.534 + b * 0.131);
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        solarize : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                prog, lastProg = 0,
                r, g, b;

            for (i=0;i<n;i+=4) {
                r = inData[i];
                g = inData[i+1];
                b = inData[i+2];
                
                outData[i] = r > 127 ? 255 - r : r;
                outData[i+1] = g > 127 ? 255 - g : g;
                outData[i+2] = b > 127 ? 255 - b : b;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },

        brightness : function(inData, outData, width, height, options, progress) {
            options = defaultOptions(options, {
                brightness : 0,
                contrast : 0
            });
            
            var contrast = clamp(options.contrast, -1, 1) / 2,
                brightness = 1 + clamp(options.brightness, -1, 1),
                prog, lastProg = 0,
                r, g, b,
                n = width * height * 4;

            var brightMul = brightness < 0 ? - brightness : brightness;
            var brightAdd = brightness < 0 ? 0 : brightness;

            contrast = 0.5 * Math.tan((contrast + 1) * Math.PI/4);
            contrastAdd = - (contrast - 0.5) * 255;

            for (var i=0;i<n;i+=4) {
                r = inData[i];
                g = inData[i+1];
                b = inData[i+2];
                
                r = (r + r * brightMul + brightAdd) * contrast + contrastAdd;
                g = (g + g * brightMul + brightAdd) * contrast + contrastAdd;
                b = (b + b * brightMul + brightAdd) * contrast + contrastAdd;
                
                outData[i] = r;
                outData[i+1] = g;
                outData[i+2] = b;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        desaturate : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                prog, lastProg = 0,
                level;

            for (var i=0;i<n;i+=4) {
                level = inData[i] * 0.3 + inData[i+1] * 0.59 + inData[i+2] * 0.11;
                outData[i] = level;
                outData[i+1] = level;
                outData[i+2] = level;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        lighten : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                prog, lastProg = 0,
                mul = 1 + clamp(options.amount, 0, 1);

            for (var i=0;i<n;i+=4) {
                outData[i] = inData[i] * mul;
                outData[i+1] = inData[i+1] * mul;
                outData[i+2] = inData[i+2] * mul;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        noise : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                prog, lastProg = 0,
                amount = clamp(options.amount, 0, 1),
                strength = clamp(options.strength, 0, 1),
                mono = !!options.mono,
                random = Math.random,
                rnd, r, g, b;
                
            for (var i=0;i<n;i+=4) {
                r = inData[i];
                g = inData[i+1];
                b = inData[i+2];
                
                rnd = random();
                
                if (rnd < amount) {
                    if (mono) {
                        rnd = strength * ((rnd / amount) * 2 - 1) * 255;
                        r += rnd;
                        g += rnd;
                        b += rnd;
                    } else {
                        r += strength * random() * 255;
                        g += strength * random() * 255;
                        b += strength * random() * 255;
                    }
                }
                
                outData[i] = r;
                outData[i+1] = g;
                outData[i+2] = b;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        flipv : function(inData, outData, width, height, options, progress) {
            var inPix, outPix,
                n = width * height * 4,
                prog, lastProg = 0,
                x, y;
            for (y=0;y<height;++y) {
                for (x=0;x<width;++x) {
                    inPix = (y * width + x) * 4;
                    outPix = (y * width + (width - x - 1)) * 4;
                    
                    outData[outPix] = inData[inPix];
                    outData[outPix+1] = inData[inPix+1];
                    outData[outPix+2] = inData[inPix+2];
                    outData[outPix+3] = inData[inPix+3];
                    
                    if (progress) {
                        prog = (inPix/n*100 >> 0) / 100;
                        if (prog > lastProg) {
                            lastProg = progress(prog);
                        }
                    }
                }
            }
        },
        
        fliph : function(inData, outData, width, height, options, progress) {
            var inPix, outPix,
                n = width * height * 4,
                prog, lastProg = 0,
                x, y;
            for (y=0;y<height;++y) {
                for (x=0;x<width;++x) {
                    inPix = (y * width + x) * 4;
                    outPix = ((height - y - 1) * width + x) * 4;
                    
                    outData[outPix] = inData[inPix];
                    outData[outPix+1] = inData[inPix+1];
                    outData[outPix+2] = inData[inPix+2];
                    outData[outPix+3] = inData[inPix+3];
                    
                    if (progress) {
                        prog = (inPix/n*100 >> 0) / 100;
                        if (prog > lastProg) {
                            lastProg = progress(prog);
                        }
                    }
                }
            }
        },

        blur : function(inData, outData, width, height, options, progress) {
            gaussian(inData, outData, width, height, options.kernelSize, progress);
        },

        glow : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                i, r, g, b,
                amount = options.amount,
                tmpData = [],
                gaussProgress,
                prog, lastProg = 0;

            if (progress) {
                gaussProgress = function(p) {
                    progress(p * 0.8);
                    return p;
                }
            }
            
            gaussian(inData, tmpData, width, height, options.kernelSize, gaussProgress);
            
            for (i=0;i<n;i+=4) {
                r = inData[i]   + tmpData[i]   * amount;
                g = inData[i+1] + tmpData[i+1] * amount;
                b = inData[i+2] + tmpData[i+2] * amount;
                if (r > 255) r = 255;
                if (g > 255) g = 255;
                if (b > 255) b = 255;
                outData[i] = r;
                outData[i+1] = g;
                outData[i+2] = b;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = 0.8 + (i/n*100 >> 0) / 100 * 0.2;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },

        convolve3x3 : function(inData, outData, width, height, options, progress) {
            convolve3x3(inData, outData, width, height, options.kernel, progress);
        },
        
        convolve5x5 : function(inData, outData, width, height, options, progress) {
            convolve5x5(inData, outData, width, height, options.kernel, progress);
        },
        
        // A 3x3 high-pass filter
        sharpen3x3 : function(inData, outData, width, height, options, progress) {
            var a = - clamp(options.strength, 0, 1);
            convolve3x3(
                inData, outData, width, height, 
                [[a,     a, a],
                 [a, 1-a*8, a],
                 [a,     a, a]],
                progress
            );
        },

        // A 5x5 high-pass filter
        sharpen5x5 : function(inData, outData, width, height, options, progress) {
            var a = - clamp(options.strength, 0, 1);
            convolve5x5(
                inData, outData, width, height, 
                [[a, a,      a, a, a],
                 [a, a,      a, a, a],
                 [a, a, 1-a*24, a, a],
                 [a, a,      a, a, a],
                 [a, a,      a, a, a]],
                progress
             );
        },

        // A 3x3 low-pass mean filter
        soften3x3 : function(inData, outData, width, height, options, progress) {
            var c = 1/9;
            convolve3x3(
                inData, outData, width, height, 
                [[c, c, c],
                 [c, c, c],
                 [c, c, c]],
                progress
            );
        },
        
        // A 5x5 low-pass mean filter
        soften5x5 : function(inData, outData, width, height, options, progress) {
            var c = 1/25;
            convolve5x5(
                inData, outData, width, height, 
                [[c, c, c, c, c],
                 [c, c, c, c, c],
                 [c, c, c, c, c],
                 [c, c, c, c, c],
                 [c, c, c, c, c]],
                progress
            );
        },
        
        // A 3x3 Cross edge-detect
        crossedges : function(inData, outData, width, height, options, progress) {
            var a = clamp(options.strength, 0, 1) * 5
            convolve3x3(
                inData, outData, width, height, 
                [[ 0, -a, 0],
                 [-a,  0, a],
                 [ 0,  a, 0]],
                progress,
                false, true
            );
        },
        
        // 3x3 directional emboss
        emboss : function(inData, outData, width, height, options, progress) {
            var amount = options.amount,
                angle = options.angle,
                x = Math.cos(-angle) * amount,
                y = Math.sin(-angle) * amount,
                n = width * height * 4,
                
                a00 = -x - y,
                a10 = -x,
                a20 = y - x,
                a01 = -y,
                a21 = y,
                a02 = -y + x,
                a12 = x,
                a22 = y + x,

                tmpData = [],
                
                prog, lastProg = 0,
                convProgress;
                
            if (progress) {
                convProgress = function(p) {
                    progress(p * 0.5)
                    return p;
                };
            }
            
            convolve3x3(
                inData, tmpData, width, height, 
                [[a00, a01, a02],
                 [a10,   0, a12],
                 [a20, a21, a22]]
            );
            
            for (var i=0;i<n;i+=4) {
                outData[i]   = 128 + tmpData[i];
                outData[i+1] = 128 + tmpData[i+1];
                outData[i+2] = 128 + tmpData[i+2];
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = 0.5 + (i/n*100 >> 0) / 100 * 0.5;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },

        
        // A 3x3 Sobel edge detect (similar to Photoshop's)
        findedges : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                i,
                data1 = [], 
                data2 = [],
                gr1, gr2, gg1, gg2, gb1, gb2,
                prog, lastProg = 0,
                convProgress1, convProgress2;

            if (progress) {
                convProgress1 = function(p) {
                    progress(p * 0.4);
                    return p;
                };
                convProgress2 = function(p) {
                    progress(0.4 + p * 0.4);
                    return p;
                };
            }
            
            convolve3x3(inData, data1, width, height, 
                [[-1, 0, 1],
                 [-2, 0, 2],
                 [-1, 0, 1]]
            );
            convolve3x3(inData, data2, width, height, 
                [[-1, -2, -1],
                 [ 0,  0,  0],
                 [ 1,  2,  1]]
            );
            
            for (i=0;i<n;i+=4) {
                gr1 = data1[i];
                gr2 = data2[i];
                gg1 = data1[i+1];
                gg2 = data2[i+1];
                gb1 = data1[i+2];
                gb2 = data2[i+2];
                
                if (gr1 < 0) gr1 = -gr1;
                if (gr2 < 0) gr2 = -gr2;
                if (gg1 < 0) gg1 = -gg1;
                if (gg2 < 0) gg2 = -gg2;
                if (gb1 < 0) gb1 = -gb1;
                if (gb2 < 0) gb2 = -gb2;
            
                outData[i] = 255 - (gr1 + gr2) * 0.8;
                outData[i+1] = 255 - (gg1 + gg2) * 0.8;
                outData[i+2] = 255 - (gb1 + gb2) * 0.8;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = 0.8 + (i/n*100 >> 0) / 100 * 0.2;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        // A 3x3 edge enhance
        edgeenhance3x3 : function(inData, outData, width, height, options, progress) {
            convolve3x3(
                inData, outData, width, height, 
                [[-1/9, -1/9, -1/9],
                 [-1/9,  17/9, -1/9],
                 [-1/9, -1/9, -1/9]],
                progress
            );
        },
        
        // A 5x5 edge enhance
        edgeenhance5x5 : function(inData, outData, width, height, options, progress) {
            convolve5x5(
                inData, outData, width, height, 
                [[-1/25, -1/25, -1/25, -1/25, -1/25],
                 [-1/25, -1/25, -1/25, -1/25, -1/25],
                 [-1/25, -1/25, 49/25, -1/25, -1/25],
                 [-1/25, -1/25, -1/25, -1/25, -1/25],
                 [-1/25, -1/25, -1/25, -1/25, -1/25]],
                progress
            );
        },

        // A 3x3 Laplacian edge-detect
        laplace3x3 : function(inData, outData, width, height, options, progress) {
            convolve3x3(
                inData, outData, width, height, 
                [[-1, -1, -1],
                 [-1,  8, -1],
                 [-1, -1, -1]],
                progress,
                false, true, true
            );
        },
        
        // A 5x5 Laplacian edge-detect
        laplace5x5 : function(inData, outData, width, height, options, progress) {
            convolve5x5(
                inData, outData, width, height, 
                [[-1, -1, -1, -1, -1],
                 [-1, -1, -1, -1, -1],
                 [-1, -1, 24, -1, -1],
                 [-1, -1, -1, -1, -1],
                 [-1, -1, -1, -1, -1]],
                progress,
                false, true, true
            );
        },
        
        coloradjust : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                r, g, b,
                prog, lastProg = 0,
                ar = clamp(options.r, -1, 1) * 255,
                ag = clamp(options.g, -1, 1) * 255,
                ab = clamp(options.b, -1, 1) * 255;

            for (var i=0;i<n;i+=4) {
                r = inData[i] + ar;
                g = inData[i+1] + ag;
                b = inData[i+2] + ab;
                if (r < 0) r = 0;
                if (g < 0) g = 0;
                if (b < 0) b = 0;
                if (r > 255) r = 255;
                if (g > 255) g = 255;
                if (b > 255) b = 255;
                outData[i] = r;
                outData[i+1] = g;
                outData[i+2] = b;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        colorfilter : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                i, r, g, b,
                luminosity = !!options.luminosity,
                prog, lastProg = 0,
                min, max, h, l, h1, chroma, tmp, m,
                ar = clamp(options.r, 0, 1),
                ag = clamp(options.g, 0, 1),
                ab = clamp(options.b, 0, 1);
                
            for (i=0;i<n;i+=4) {
                r = inData[i] / 255;
                g = inData[i+1] / 255;
                b = inData[i+2] / 255;
                
                l = r * 0.3 + g * 0.59 + b * 0.11;
                    
                r = (r + r * ar) / 2;
                g = (g + g * ag) / 2;
                b = (b + b * ab) / 2;

                if (luminosity) {
                    min = max = r;
                    if (g > max) max = g;
                    if (b > max) max = b;
                    if (g < min) min = g;
                    if (b < min) min = b;
                    chroma = (max - min);

                    if (r == max) {
                        h = ((g - b) / chroma) % 6;
                    } else if (g == max) {
                        h = ((b - r) / chroma) + 2;
                    } else {
                        h = ((r - g) / chroma) + 4;
                    }

                    h1 = h >> 0;
                    tmp = chroma * (h - h1);
                    r = g = b = l - (r * 0.3 + g * 0.59 + b * 0.11);
                        
                    if (h1 == 0) {
                        r += chroma; 
                        g += tmp;
                    } else if (h1 == 1) {
                        r += chroma - tmp;
                        g += chroma;
                    } else if (h1 == 2) {
                        g += chroma;
                        b += tmp;
                    } else if (h1 == 3) {
                        g += chroma - tmp;
                        b += chroma;
                    } else if (h1 == 4) {
                        r += tmp;
                        b += chroma;
                    } else if (h1 == 5) {
                        r += chroma;
                        b += chroma - tmp;
                    }
                }

                outData[i] = r * 255;
                outData[i+1] = g * 255;
                outData[i+2] = b * 255;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        hsl : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                hue = clamp(options.hue, -1, 1),
                saturation = clamp(options.saturation, -1, 1),
                lightness = clamp(options.lightness, -1, 1),
                satMul = 1 + saturation * (saturation < 0 ? 1 : 2),
                lightMul = lightness < 0 ? 1 + lightness : 1 - lightness,
                lightAdd = lightness < 0 ? 0 : lightness * 255,
                vs, ms, vm, h, s, l, v, m, vmh, sextant,
                prog, lastProg = 0;

            hue = (hue * 6) % 6;
                    
            for (var i=0;i<n;i+=4) {

                r = inData[i];
                g = inData[i+1];
                b = inData[i+2];
                
                if (hue != 0 || saturation != 0) {
                    // ok, here comes rgb to hsl + adjust + hsl to rgb, all in one jumbled mess. 
                    // It's not so pretty, but it's been optimized to get somewhat decent performance.
                    // The transforms were originally adapted from the ones found in Graphics Gems, but have been heavily modified.
                    vs = r;
                    if (g > vs) vs = g;
                    if (b > vs) vs = b;
                    ms = r;
                    if (g < ms) ms = g;
                    if (b < ms) ms = b;
                    vm = (vs-ms);
                    l = (ms+vs)/510;
                    
                    if (l > 0 && vm > 0) {
                        if (l <= 0.5) {
                            s = vm / (vs+ms) * satMul;
                            if (s > 1) s = 1;
                            v = (l * (1+s));
                        } else {
                            s = vm / (510-vs-ms) * satMul;
                            if (s > 1) s = 1;
                            v = (l+s - l*s);
                        }
                        if (r == vs) {
                            if (g == ms) {
                                h = 5 + ((vs-b)/vm) + hue;
                            } else {
                                h = 1 - ((vs-g)/vm) + hue;
                            }
                        } else if (g == vs) {
                            if (b == ms) {
                                h = 1 + ((vs-r)/vm) + hue;
                            } else {
                                h = 3 - ((vs-b)/vm) + hue;
                            }
                        } else {
                            if (r == ms) {
                                h = 3 + ((vs-g)/vm) + hue;
                            } else {
                                h = 5 - ((vs-r)/vm) + hue;
                            }
                        }
                        if (h < 0) h += 6;
                        if (h >= 6) h -= 6;
                        m = (l + l - v);
                        sextant = h >> 0;
                        vmh = (v - m) * (h - sextant);
                        if (sextant == 0) {
                            r = v; 
                            g = m + vmh;
                            b = m;
                        } else if (sextant == 1) {
                            r = v - vmh;
                            g = v;
                            b = m;
                        } else if (sextant == 2) {
                            r = m;
                            g = v;
                            b = m + vmh;
                        } else if (sextant == 3) {
                            r = m;
                            g = v - vmh;
                            b = v;
                        } else if (sextant == 4) {
                            r = m + vmh;
                            g = m;
                            b = v;
                        } else if (sextant == 5) {
                            r = v;
                            g = m;
                            b = v - vmh;
                        }
                        
                        r *= 255;
                        g *= 255;
                        b *= 255;
                    }
                }
                
                r = r * lightMul + lightAdd;
                g = g * lightMul + lightAdd;
                b = b * lightMul + lightAdd;
                
                if (r < 0) r = 0;
                if (g < 0) g = 0;
                if (b < 0) b = 0;
                if (r > 255) r = 255;
                if (g > 255) g = 255;
                if (b > 255) b = 255;
                
                outData[i] = r;
                outData[i+1] = g;
                outData[i+2] = b;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        posterize : function(inData, outData, width, height, options, progress) {
            var numLevels = clamp(options.levels, 2, 256),
                numAreas = 256 / numLevels,
                numValues = 256 / (numLevels-1),
                r, g, b,
                n = width * height * 4,
                prog, lastProg = 0;

            for (i=0;i<n;i+=4) {
            
                outData[i] = numValues * ((inData[i] / numAreas)>>0);
                outData[i+1] = numValues * ((inData[i+1] / numAreas)>>0); 
                outData[i+2] = numValues * ((inData[i+2] / numAreas)>>0); 
            
                outData[i+3] = inData[i+3];

                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
            
        },
        
        removenoise : function(inData, outData, width, height, options, progress) {
            var r, g, b, c, y, x, idx,
                pyc, pyp, pyn,
                pxc, pxp, pxn,
                minR, minG, minB, maxR, maxG, maxB,
                n, prog, lastProg = 0;
                
            n = width * height * 4;
                
            for (y=0;y<height;++y) {
                pyc = y * width * 4;
                pyp = pyc - width * 4;
                pyn = pyc + width * 4;

                if (y < 1) pyp = pyc;
                if (y >= width-1) pyn = pyc;
                
                for (x=0;x<width;++x) {
                    idx = (y * width + x) * 4;
                    
                    pxc = x * 4;
                    pxp = pxc - 4;
                    pxn = pxc + 4;
              
                    if (x < 1) pxp = pxc;
                    if (x >= width-1) pxn = pxc;
                    
                    minR = maxR = inData[pyc + pxp];
                    c = inData[pyc + pxn];
                    if (c < minR) minR = c;
                    if (c > maxR) maxR = c;
                    c = inData[pyp + pxc];
                    if (c < minR) minR = c;
                    if (c > maxR) maxR = c;
                    c = inData[pyn + pxc];
                    if (c < minR) minR = c;
                    if (c > maxR) maxR = c;

                    minG = inData[pyc + pxp + 1];
                    c = inData[pyc + pxn + 1];
                    if (c < minG) minG = c;
                    c = inData[pyp + pxc + 1];
                    if (c < minG) minG = c;
                    c = inData[pyn + pxc + 1];
                    if (c < minG) minG = c;
                    
                    minB = inData[pyc + pxp + 2];
                    c = inData[pyc + pxn + 2];
                    if (c < minB) minB = c;
                    c = inData[pyp + pxc + 2];
                    if (c < minB) minB = c;
                    c = inData[pyn + pxc + 2];
                    if (c < minB) minB = c;

                    r = inData[idx]
                    g = inData[idx + 1]
                    b = inData[idx + 2]
                    
                    if (r < minR) r = minR;
                    if (r > maxR) r = maxR;
                    if (g < minG) g = minG;
                    if (g > maxG) g = maxG;
                    if (b < minB) b = minB;
                    if (b > maxB) b = maxB;
                    
                    outData[idx] = r;
                    outData[idx+1] = g;
                    outData[idx+2] = b;
                    outData[idx+3] = inData[idx+3];
                    
                    if (progress) {
                        prog = (idx/n*100 >> 0) / 100;
                        if (prog > lastProg) {
                            lastProg = progress(prog);
                        }
                    }
                }
            }
        },

        mosaic : function(inData, outData, width, height, options, progress) {

            var blockSize = clamp(options.blockSize, 1, Math.max(width, height)),
                yBlocks = Math.ceil(height / blockSize),
                xBlocks = Math.ceil(width / blockSize),
                y0, y1, x0, x1, idx, pidx,
                n = yBlocks * xBlocks,
                prog, lastProg = 0;

            for (i=0, y0=0, bidx=0;i<yBlocks;i++) {
                y1 = clamp(y0 + blockSize, 0, height);
                for(j=0, x0=0;j<xBlocks;j++,bidx++) {
                    x1 = clamp(x0 + blockSize, 0, width);

                    idx = (y0 * width + x0) << 2;
                    var r = inData[idx], g = inData[idx+1], b = inData[idx+2];

                    for(bi=y0;bi<y1;bi++) {
                        for(bj=x0;bj<x1;bj++) {
                            pidx = (bi*width+bj) << 2;
                            outData[pidx] = r, outData[pidx+1] = g, outData[pidx+2] = b;
                            outData[pidx+3] = inData[pidx+3];
                        }
                    }

                    x0 = x1;

                    if (progress) {
                        prog = (bidx/n*100 >> 0) / 100;
                        if (prog > lastProg) {
                            lastProg = progress(prog);
                        }
                    }
                }
                y0 = y1;
            }
        },

        equalize : function(inData, outData, width, height, options, progress) {
            var n = width * height, p, i, level, ratio,
                prog, lastProg;
            var round = Math.round;
            // build histogram
            var pdf = new Array(256);
            for (i=0;i<256;i++) {
                pdf[i] = 0;
            }

            for (i=0;i<n;i++) {
                p = i * 4;
                level = clamp(round(inData[p] * 0.3 + inData[p+1] * 0.59 + inData[p+2] * 0.11), 0, 255);
                outData[p+3] = level;
                pdf[ level ]++;
            }

            // build cdf
            var cdf = new Array(256);
            cdf[0] = pdf[0];
            for(i=1;i<256;i++) {
                cdf[i] = cdf[i-1] + pdf[i];
            }

            // normalize cdf
            for(i=0;i<256;i++) {
                cdf[i] = cdf[i] / n * 255.0;
            }

            // map the pixel values
            for (i=0;i<n;i++) {
                p = i * 4;
                level = outData[p+3];
                ratio = cdf[level] / (level || 1);
                outData[p] = clamp(round(inData[p] * ratio), 0, 255);
                outData[p+1] = clamp(round(inData[p+1] * ratio), 0, 255);
                outData[p+2] = clamp(round(inData[p+2] * ratio), 0, 255);
                outData[p+3] = inData[p+3];

                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        }
    };

});
﻿/*

Linear Algebra
-- Matrix multiplication
-- Determinant
-- Matrix inversion
-- Cholesky Decomposition
-- Eigen decomposition -- TODO

*/

(()=>{
Array.prototype.mmult=function(other){
       var left_shape=this.shape;
       var right_shape=other.shape;
       if(left_shape[0]!=right_shape[1] || left_shape[1]!=right_shape[0]) throw("Dimension mismatch");
       other_transpose=other.transpose();
       return this.map(row=>other_transpose.map(col=>row.dot(col)));

	
};

Array.prototype.inverse = function(){
	shape=this.shape();
	if(shape[0]!=shape[1]) throw("Matrix has to be square");
	
	  const n = shape[0];
	  var identity = [];
	  var inverse = [];
	  let det = 1;
	  idx=range(0,n,1);
	
	  // Create identity matrix
	  identity=idx.map(i=>idx.map(j=>i==j?1:0));
	  copy=idx.map(i=>idx.map(j=>this[i][j]));
	  
	  
	
	  // Gaussian elimination with partial pivoting
	  for (let i = 0; i < n; i++) {
	    let maxRow = i;
	    for (let j = i + 1; j < n; j++) {
	      if (Math.abs(copy[j][i]) > Math.abs(copy[maxRow][i])) {
	        maxRow = j;
	      }
	    }
	
	    // Swap rows
	    const tmp = copy[i];
	    copy[i] = copy[maxRow];
	    copy[maxRow] = tmp;
	
	    const tmp2 = identity[i];
	    identity[i] = identity[maxRow];
	    identity[maxRow] = tmp2;
	
	    // Check if matrix is singular
	    if (copy[i][i] === 0) {
	      return null;
	    }
	
	    // Scale row
	    const pivot = copy[i][i];
	    det *= pivot;
	    for (let j = 0; j < n; j++) {
	      copy[i][j] /= pivot;
	      identity[i][j] /= pivot;
	    }
	
	    // Eliminate column
	    for (let j = 0; j < n; j++) {
	      if (j !== i) {
	        const factor = copy[j][i];
	        for (let k = 0; k < n; k++) {
	          copy[j][k] -= factor * copy[i][k];
	          identity[j][k] -= factor * identity[i][k];
	        }
	      }
	    }
	  }
	
	  // Inverse is in the identity matrix
	  return identity;
	

}

Array.prototype.determinant=function(){
	shape=this.shape();
	if(shape[0]!=shape[1]) throw("Matrix has to be square");
	n=shape[0];
	if(n==1)
		this[0][0];
	let det = 0;
	  for (let i = 0; i < n; i++) {
	    var subMatrix = this.transpose()
	    subMatrix.splice(i,1);
	    subMatrix=subMatrix.transpose();
	    subMatrix.shift();

	    
	
	    const sign = i % 2 === 0 ? 1 : -1;
		
	    det += sign * this[0][i] * subMatrix.determinant();
		
	  }
	  return det;
	
}

const cholesky = function (array) {
	shape=array.shape()
	if (shape[0]!=shape[1]) throw("Matrix has to be square");
	const zeros = [...Array(shape[0])].map( _ => Array(shape[0]).fill(0));
	const L = zeros.map((row, r, xL) => row.map((v, c) => {
		const sum = row.reduce((s, _, i) => i < c ? s + xL[r][i] * xL[c][i] : s, 0);
		return xL[r][c] = c < r + 1 ? r === c ? Math.sqrt(array[r][r] - sum) : (array[r][c] - sum) / xL[c][c] : v;
	}));
	return L;
}

Array.prototype.cholesky=function(){return cholesky(this)}

})();norm_dist={}

norm_dist.stdcdf=function(x){   //HASTINGS.  MAX ERROR = .000001
	var T=1/(1+.2316419*Math.abs(x));
	var D=.3989423*Math.exp(-x*x/2);
	var p=D*T*(.3193815+T*(-.3565638+T*(1.781478+T*(-1.821256+T*1.330274))));
	if (x>0) {
		p=1-p
	}
	return p
}   

norm_dist.dist = function(z) {
  return (1.0/(Math.sqrt(2*Math.PI)))*Math.exp(-0.5*z);
  //??  Math.exp(-0.5*z*z)
};

norm_dist.cdf=function(z,mu,sd) {

	if (sd<0) {
		throw("The standard deviation must be nonnegative.")
	} else if (sd==0) {
	    if (z<mu){
	        return 0;
	    } else {
		    return 1;
		}
	} else {
		return norm_dist.normalcdf((z-mu)/sd);
			}

}

norm_dist.nrand = function() {
	var x1, x2, rad, y1;
	do {
		x1 = 2 * Math.random() - 1;
		x2 = 2 * Math.random() - 1;
		rad = x1 * x1 + x2 * x2;
	} while(rad >= 1 || rad == 0);	
	var c = Math.sqrt(-2 * Math.log(rad) / rad);	
	return x1 * c;
};

/* functions to upload files to p2p.. network and download.
It is a layer on top of Webtorrents/ipfs-js etc */
/** tools for discovering peers.. including interacting with stun servers **/
/** Files for computing map-reduce jobs on p2p framework **/
/*
brownian montion
*/

if (brownian==undefined) var brownian={};

brownian.time_series=function(length, mu, sigma,start,dist,increment_period){
	 moves=random.oned.normal(length,mu*increment_period,Math.sqrt(increment_period)*sigma);
	 moves=moves.map((cummulative=> value => cummulative += value)(0));
	 if(dist=='normal'){
	 	return moves.add(start);
	 }
	 
	 if(dist=='log-normal'){
	 	return moves.exp().mult(start);
	 }
}

brownian.multi_series=function(length, means, covar,starts,dist,increment_period){
	 shape=covar.shape();
	 if(shape[0] != shape[1]) throw("Covariance has to be symmetric");
	 if(means.length!=shape[0]) throw("Number of means should be same as number of variables in covariance");
	 if(starts.length!=shape[0]) throw("Number of starting values should be same as number of variables in covariance");
	 n=shape[0];
	 
	 
	 sigma=covar.cholesky().transpose().mult(Math.sqrt(increment_period));
	 mu=means.mult(increment_period);
	 moves=random.twod.normal(length,n,0,1);
	 moves=moves.mmult(sigma).map(x=>x.add(mu));
	 zeros= starts.map(x=>0);
	 moves=moves.map((cummulative => row => (cummulative=cummulative.add(row)))(zeros));
	 if(dist=='normal'){
	 	return moves.map(x=>x.add(starts));
	 }
	 
	 if(dist=='log-normal'){
	 	return  moves.map(x=>x.exp().mult(starts));
	 	
	 }
}

if(window!=undefined)	
	window.brownian=brownian;/* 
single random_nromal var
array of random normal var
*/
(()=>{
if(random==undefined) 
	var random ={};
random.normal=function(mu,sigma){
	return norm_dist.nrand()*sigma+mu;
}

random.choice=function(choices){
	return choices[Math.floor( choices.length* Math.random())];
}

random.uniform=function(minimum,maximum){
	return Math.random()*(maximum-minimum)+minimum;
}
	
random.lognormal=function(mu,sigma){
	return Math.exp(random.normal(mu,sigma))
}
	
random.oned={};


random.oned.normal=function(length,mu,sigma){
	return Array.from({length: length}, 
		()=>random.normal(mu,sigma)
	  )
}

random.oned.uniform=function(length,minimum,maximum){
	return Array.from({length: length}, 
		()=>Math.random()*(maximum-minimum)+minimum
	  )
}
random.oned.lognormal=function(length,mu,sigma){
	return Array.from({length: length}, 
		()=>Math.exp(random.normal(mu,sigma))
	  )
}

random.oned.choice=function(length,choices){
	l=choices.length;

	return Array.from({length: length}, 
		()=>choices[Math.floor( l* Math.random())]
	  )
}

random.twod={};
random.twod.normal=function(length,width,mu,sigma){
	return Array.from({length: length}, 
		()=>random.oned.normal(width,mu,sigma)
	  )
}

random.twod.uniform=function(length,width,minimum,maximum){
	return Array.from({length: length}, 
		()=>random.oned.uniform(width,minimum,maximum)
	  )
}
random.twod.lognormal=function(length,mu,sigma){
	return Array.from({length: length}, 
		()=>random.oned.lognormal(width,mu,sigma)
	  )
}

random.twod.choice=function(length,width,choices){


	return Array.from({length: length}, 
		()=>random.twod.choice(width,choices)
	  )
}


if(window!=undefined)
	window.random=random;



})();