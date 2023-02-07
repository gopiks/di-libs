norm_dist={}

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

