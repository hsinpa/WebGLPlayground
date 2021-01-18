import './stylesheet/main.scss';
import DeepParallel from './DeepParallel/DeepParallel';
import {ParallelDataType} from './DeepParallel/ParallelDataType';

window.onload = () => {
    console.log("ONLOAD");
    let parallelModule = new DeepParallel( document.querySelector("body") );
    
    fetch('./Dataset/parallel_setting.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        parallelModule.SetConfig( myJson );
    });
};