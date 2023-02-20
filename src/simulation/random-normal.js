/* 
single random_nromal var
array of random normal var
*/
((){
if(random==undefined) 
	var random ={};
	
random.normal={};

random.normal.single=function(mu,sigma){
	return norm_dist.nrand()*sigma+mu;
}

random.normal.oned=function(length,mu,sigma){
	return Array.from({length: length}, 
		()=>random.normal.single(mu,sigma)
	  )
}

if(window!=undefined)
	window.random=random;



})();