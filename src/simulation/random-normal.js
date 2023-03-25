/* 
single random_nromal var
array of random normal var
*/
(()=>{
if(random==undefined) 
	var random ={};
	
random.oned={};

random.normal=function(mu,sigma){
	return norm_dist.nrand()*sigma+mu;
}

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

if(window!=undefined)
	window.random=random;



})();