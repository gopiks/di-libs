/*

Linear Algebra
-- Matrix multiplication
-- Determinant
-- Solve linear eqns/matrix inversion
-- Cholesky Decomposition
-- Eigne decomposition

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
	  inverse=idx.map(i=>idx.map(j=>this[i][j]));
	  
	  
	
	  // Gaussian elimination with partial pivoting
	  for (let i = 0; i < n; i++) {
	    let maxRow = i;
	    for (let j = i + 1; j < n; j++) {
	      if (Math.abs(inverse[j][i]) > Math.abs(inverse[maxRow][i])) {
	        maxRow = j;
	      }
	    }
	
	    // Swap rows
	    const tmp = inverse[i];
	    inverse[i] = inverse[maxRow];
	    inverse[maxRow] = tmp;
	
	    const tmp2 = identity[i];
	    identity[i] = identity[maxRow];
	    identity[maxRow] = tmp2;
	
	    // Check if matrix is singular
	    if (inverse[i][i] === 0) {
	      return null;
	    }
	
	    // Scale row
	    const pivot = inverse[i][i];
	    det *= pivot;
	    for (let j = 0; j < n; j++) {
	      inverse[i][j] /= pivot;
	      identity[i][j] /= pivot;
	    }
	
	    // Eliminate column
	    for (let j = 0; j < n; j++) {
	      if (j !== i) {
	        const factor = inverse[j][i];
	        for (let k = 0; k < n; k++) {
	          inverse[j][k] -= factor * inverse[i][k];
	          identity[j][k] -= factor * identity[i][k];
	        }
	      }
	    }
	  }
	
	  // Inverse is in the right half of identity matrix
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

Array.prototype.cholesky = function(){
	shape=this.shape();
	if(shape[0]!=shape[1]) throw("Matrix has to be square");
	  const n = this.length;
	  const lowerTriangular = [];
	idx=range(0,n,1);
	lowerTriangular=idx.map(i=>idx.map(j=>0));
	
	
	  for (let i = 0; i < n; i++) {
	    for (let j = 0; j <= i; j++) {
	      let sum = 0;
	
	      for (let k = 0; k < j; k++) {
	        sum += lowerTriangular[i][k] * lowerTriangular[j][k];
	      }
	
	      if (i === j) {
	        lowerTriangular[i][j] = Math.sqrt(this[i][i] - sum);
	      } else {
	        lowerTriangular[i][j] = (1 / lowerTriangular[j][j]) * (this[i][j] - sum);
	      }
	    }
	  }
	
	  return lowerTriangular;


}

})();