import REGL, {Regl} from 'regl';
import {GLSLDataSet} from './WebglType';
import {Dictionary} from 'typescript-collections';

class WebglUtility {
    async PrepareREGLShader(vertFilePath: string, fragFilePath: string) {
        let VertPros = fetch(vertFilePath, {method: 'GET', credentials: 'include'});
        let FragPros = fetch(fragFilePath, {method: 'GET', credentials: 'include'});
    
        return Promise.all([VertPros, FragPros ])
        .then( responses =>
            Promise.all(
                [responses[0].text(), responses[1].text()]
            )
        ).then((values) => {
            let gLSLDataSet : GLSLDataSet = {
                vertex_shader : values[0],
                fragment_shader : values[1],
            };

            return gLSLDataSet; 
        });
    }
}

export default WebglUtility;