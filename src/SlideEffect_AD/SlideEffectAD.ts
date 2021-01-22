import REGL = require('regl');
import SimpleCanvas from '../Hsinpa/SimpleCanvas';

class SlideEffectAD extends SimpleCanvas {
    constructor(queryString :string) {
        super(queryString);

        if (this.IsProgramValid) {
            
            // let regl = REGL(queryString);
            // console.log(regl);
        }
    }
}

export default SlideEffectAD;