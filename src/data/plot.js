// Take dataframe as dataframejs or 2D array or X and Y as arrays
// Following plots:
// pie(X,Y, layout). 
// bar(labels,[Ys],layout)
// line([{x:,y:}],layout)
// scatter([{x:,y:}],layout)
//. Returns html.


Array.prototype.plot = function(dom,type,params){
  if(params == undefined) params ={};
  new_div=document.createElement("div");
  new_div.id='plot_'+(Math.random() + 1).toString(36).substring(7);
  dom.appendChild(new_div);
  if(type=='line' || type=='bar' ){
  	if(params['name']!=undefined) var name=params['name'];
  	else if(params['names']!=undefined) var name=String(params['names']);
	var data=[{"y":this,type:type,name:name}];
	
	Plotly.newPlot(new_div, data,params['layout']);
	

  }
  if(type=='multiline'){
  
  	var data=[];
  	
  	if(params['names']!=undefined) var names=params['names'];
  	
	
  	this.forEach(l=>{
  		if(names!=undefined && names.length>0)
			data.push({"y":l,type:'line',name:names.shift()});
		else
			data.push({"y":l,type:'line'});
	});
	Plotly.newPlot(new_div, data,params['layout']);

  }
  if(type=='scatter'){
    	if(params['name']!=undefined) var name=params['name'];
  	else if(params['names']!=undefined) var name=String(params['names']);
	var data=[{y:this[1],x:this[0],type:type,name:name}];
	
	Plotly.newPlot(new_div, data,params['layout']);
  
  }
  if(type=='multi-scatter'){
    	var data=[];
  	
  	if(params['names']!=undefined) var names=params['names'];
  	
	
  	this.forEach(l=>{
  		if(names!=undefined && names.length>0)
			data.push({y:l[1],x:l[0],type:'scatter',name:names.shift()});
		else
			data.push({y:l[1],x:l[0],type:'scatter'});
	});
	Plotly.newPlot(new_div, data,params['layout']);
  
  }
  return new_div.id;  
}


