function normalcdf(X){   //HASTINGS.  MAX ERROR = .000001
	var T=1/(1+.2316419*Math.abs(X));
	var D=.3989423*Math.exp(-X*X/2);
	var Prob=D*T*(.3193815+T*(-.3565638+T*(1.781478+T*(-1.821256+T*1.330274))));
	if (X>0) {
		Prob=1-Prob
	}
	return Prob
}   

function ndist(z) {
  return (1.0/(Math.sqrt(2*Math.PI)))*Math.exp(-0.5*z);
  //??  Math.exp(-0.5*z*z)
}

function n(Z,M,SD) {

    with (Math) {
		if (SD<0) {
			alert("The standard deviation must be nonnegative.")
		} else if (SD==0) {
		    if (Z<M){
		        Prob=0
		    } else {
			    Prob=1
			}
		} else {
			Prob=normalcdf((Z-M)/SD);
			Prob=round(100000*Prob)/100000;
		}
	}
    form.result.value = Prob;
}


nrand = function() {
	var x1, x2, rad, y1;
	do {
		x1 = 2 * Math.random() - 1;
		x2 = 2 * Math.random() - 1;
		rad = x1 * x1 + x2 * x2;
	} while(rad >= 1 || rad == 0);	
	var c = Math.sqrt(-2 * Math.log(rad) / rad);	
	return x1 * c;
}