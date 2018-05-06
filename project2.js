//Nathan Hauke, Josh Lopez
var gl;
var tableShaderProgram;
var chairShaderProgram;


var tableVertices = [];
var tableIndexList = [];
var tableVertexNormals = [];
var tableTextureCoordinates = [];

var chairVertices = [];
var chairIndexList = [];
var chairVertexNormals = [];
var chairTextureCoordinates = [];


var chairFaces = 288;
var callbackcount = 0;
var tableFaces = 152;

var transX = 0;
var transY = 0;
var transZ = 0;
var beta = .0;

function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if ( !gl ) { alert("WebGL isn't available"); }

    gl.enable(gl.DEPTH_TEST);
    gl.viewport( 0, 0, 512, 512 );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    tableShaderProgram = initShaders( gl, "table-vertex-shader", "table-fragment-shader" );

    chairShaderProgram = initShaders(gl, "chair-vertex-shader", "chair-fragment-shader");


    var objLoader = new THREE.OBJLoader();
    console.log("here");
    objLoader.load( "WoodenTable.obj ", function(object){

        var len = object.children.length;


        for(var i=0; i<len; i++){

            var geometry = object.children[i].geometry;

            var vertices_array = geometry.attributes.position.array;

            var l = vertices_array.length/3;

            for(var j=0; j<l; j++){

                tableVertices.push( vec4(vertices_array[3*j],vertices_array[3*j+1],vertices_array[3*j+2],1));

                tableIndexList.push( 3*j );
                tableIndexList.push( 3*j+1 );
                tableIndexList.push( 3*j+2 );

                tableVertexNormals.push( vec2( geometry.attributes.normal.array[3*j],
                                    geometry.attributes.normal.array[3*j+1],
                                    geometry.attributes.normal.array[3*j+2]) );
                tableTextureCoordinates.push( vec2( geometry.attributes.uv.array[2*j],
                                    geometry.attributes.uv.array[2*j+1] ));

            }

        }

        callbackcount++;
} );

objLoader.load( "SimpleChair.obj ", function(object){

        var len = object.children.length;


        for(var i=0; i<len; i++){

            var geometry = object.children[i].geometry;

            var vertices_array = geometry.attributes.position.array;

            var l = vertices_array.length/3;

            for(var j=0; j<l; j++){
                chairVertices.push( vec4(vertices_array[3*j],vertices_array[3*j+1],vertices_array[3*j+2],1));


                chairIndexList.push( 3*j );
                chairIndexList.push( 3*j+1 );
                chairIndexList.push( 3*j+2 );

                chairVertexNormals.push( vec2( geometry.attributes.normal.array[3*j],
                                    geometry.attributes.normal.array[3*j+1],
                                    geometry.attributes.normal.array[3*j+2]) );
                chairTextureCoordinates.push( vec2( geometry.attributes.uv.array[2*j],
                                    geometry.attributes.uv.array[2*j+1] ));

            }

        }
        callbackcount++;
} );

objLoader.load( "SimpleChair.obj ", function(object){

        var len = object.children.length;

        callbackcount++;
} );

continueExecution();
    console.log("here1");
}

function continueExecution() {
    if (callbackcount < 3 ) {
        setTimeout( continueExecution, 1000 );
        return;
    }
    drawObject();
}



function drawObject() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    gl.useProgram( tableShaderProgram );
    setupTableBuffer();

    gl.useProgram( chairShaderProgram );
    setupChairBuffer();

    requestAnimFrame(drawObject);
}


function setupTableBuffer() {
    gl.useProgram(tableShaderProgram);
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tableIndexList), gl.STATIC_DRAW);

    var verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(tableVertices), gl.STATIC_DRAW);

    var myPosition = gl.getAttribLocation(tableShaderProgram,"myPosition");
    gl.vertexAttribPointer( myPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );


    var normalsbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(tableVertexNormals), gl.STATIC_DRAW);

    var vertexNormalPointer = gl.getAttribLocation(tableShaderProgram, "nv");
    gl.vertexAttribPointer(vertexNormalPointer, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexNormalPointer);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(tableTextureCoordinates), gl.STATIC_DRAW );

	var textureCoordinate = gl.getAttribLocation(tableShaderProgram, "textureCoordinate");
	gl.vertexAttribPointer(textureCoordinate, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(textureCoordinate);

    var myImage = document.getElementById("Wood_Cherry_Original");
    configureTexture(myImage);


    var e = vec3(40.0, 60.0, 50.0);
    var a = vec3(0.0, 0.0, 0.0);
    var vup = vec3(0.0, 1.0, 0.0);
    var n = normalize( vec3(e[0]-a[0], e[1]-a[1], e[2]-a[2]) );
    var u = normalize( cross(vup, n) );
    var v = normalize( cross(n, u) );
    var modelviewMatrix = [u[0], v[0], n[0], 0.0,
                           u[1], v[1], n[1], 0.0,
                           u[2], v[2], n[2], 0.0,
                           -u[0]*e[0]-u[1]*e[1]-u[2]*e[2],
                           -v[0]*e[0]-v[1]*e[1]-v[2]*e[2],
                           -n[0]*e[0]-n[1]*e[1]-n[2]*e[2], 1.0];

    var modelviewMatrixInverseTranspose = [u[0], v[0], n[0], e[0],
                                           u[1], v[1], n[1], e[1],
                                           u[2], v[2], n[2], e[2],
                                            0.0,  0.0,  0.0,  1.0];

    var modelviewMatrixLocation = gl.getUniformLocation(tableShaderProgram, "M");
    gl.uniformMatrix4fv(modelviewMatrixLocation, false, modelviewMatrix);

    var modelviewMatrixInverseTransposeLocation = gl.getUniformLocation(tableShaderProgram, "M_inversetranspose");
    gl.uniformMatrix4fv(modelviewMatrixInverseTransposeLocation, false, modelviewMatrixInverseTranspose);


// projection matrix
    var left = 50.0;
    var right = -10.0;
    var top_ = 60.0;
    var bottom = -50.0;
    var near = 40.0;
    var far = 100.0;



// perspective projection matrix
    var perspectiveProjectionMatrix =
    [2.0*near/(right-left), .0, .0, .0,
     .0, 2.0*near/(top_-bottom), .0, .0,
     (right+left)/(right-left), (top_+bottom)/(top_-bottom), -(far+near)/(far-near), -1.0,
     .0, .0, -2.0*far*near/(far-near), .0];


    var perspectiveProjectionMatrixLocation = gl.getUniformLocation(tableShaderProgram, "P_persp");
     gl.uniformMatrix4fv(perspectiveProjectionMatrixLocation, false, perspectiveProjectionMatrix);

    //Light One
     var kaloc = gl.getUniformLocation(tableShaderProgram, "ka");
     var kdloc = gl.getUniformLocation(tableShaderProgram, "kd");
     var ksloc = gl.getUniformLocation(tableShaderProgram, "ks");
     gl.uniform3f( kaloc, 0.5, 0.5, 0.5);
     gl.uniform3f( kdloc, 0.5, 0.5, 0.5);
     gl.uniform3f( ksloc, 1.0, 1.0, 1.0);
     var alphaloc = gl.getUniformLocation(tableShaderProgram, "alpha");
     gl.uniform1f(alphaloc, 4.0);

     var p0loc = gl.getUniformLocation(tableShaderProgram, "p0");
     gl.uniform3f(p0loc, -40.0, 50.0, -15.0);

     var Ialoc = gl.getUniformLocation(tableShaderProgram, "Ia");
     var Idloc = gl.getUniformLocation(tableShaderProgram, "Id");
     var Isloc = gl.getUniformLocation(tableShaderProgram, "Is");
     gl.uniform3f( Ialoc, 0.1, 0.1, 0.1);
     gl.uniform3f( Idloc, 0.8, 0.8, 0.5);
     gl.uniform3f( Isloc, 0.8, 0.8, 0.8);

     //Light Two
     var kaloc2 = gl.getUniformLocation(tableShaderProgram, "ka2");
     var kdloc2 = gl.getUniformLocation(tableShaderProgram, "kd2");
     var ksloc2 = gl.getUniformLocation(tableShaderProgram, "ks2");
     gl.uniform3f( kaloc2, 0.5, 0.5, 0.5);
     gl.uniform3f( kdloc2, 0.5, 0.5, 0.5);
     gl.uniform3f( ksloc2, 1.0, 1.0, 1.0);
     var alphaloc2 = gl.getUniformLocation(tableShaderProgram, "alpha2");
     gl.uniform1f(alphaloc2, 4.0);

     var p0loc2 = gl.getUniformLocation(tableShaderProgram, "p0_2");
     gl.uniform3f(p0loc2, 50.0, 30.0, -5.0);

     var Ialoc2 = gl.getUniformLocation(tableShaderProgram, "Ia2");
     var Idloc2 = gl.getUniformLocation(tableShaderProgram, "Id2");
     var Isloc2 = gl.getUniformLocation(tableShaderProgram, "Is2");
     gl.uniform3f( Ialoc2, 0.1, 0.1, 0.1);
     gl.uniform3f( Idloc2, 0.8, 0.8, 0.5);
     gl.uniform3f( Isloc2, 0.8, 0.8, 0.8);


    gl.uniform1i(gl.getUniformLocation(tableShaderProgram,"texMap0"), 0);

    gl.drawElements( gl.TRIANGLES, tableFaces , gl.UNSIGNED_SHORT, 0 );

}

function setupChairBuffer() {
    gl.useProgram(chairShaderProgram);
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(chairIndexList), gl.STATIC_DRAW);

    var verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(chairVertices), gl.STATIC_DRAW);

    var myPosition = gl.getAttribLocation(chairShaderProgram,"myPosition");
    gl.vertexAttribPointer( myPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );


    var normalsbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(chairVertexNormals), gl.STATIC_DRAW);

    var vertexNormalPointer = gl.getAttribLocation(chairShaderProgram, "nv");
    gl.vertexAttribPointer(vertexNormalPointer, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexNormalPointer);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(chairTextureCoordinates), gl.STATIC_DRAW );

	var textureCoordinate = gl.getAttribLocation(chairShaderProgram, "textureCoordinate");
	gl.vertexAttribPointer(textureCoordinate, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(textureCoordinate);

    var myImage = document.getElementById("Wood");
    configureTexture(myImage);

    var e = vec3(40.0, 60.0, 50.0);
    var a = vec3(0.0, 0.0, 0.0);
    var vup = vec3(0.0, 1.0, 0.0);
    var n = normalize( vec3(e[0]-a[0], e[1]-a[1], e[2]-a[2]) );
    var u = normalize( cross(vup, n) );
    var v = normalize( cross(n, u) );
    var modelviewMatrix = [u[0], v[0], n[0], 0.0,
                           u[1], v[1], n[1], 0.0,
                           u[2], v[2], n[2], 0.0,
                           -u[0]*e[0]-u[1]*e[1]-u[2]*e[2],
                           -v[0]*e[0]-v[1]*e[1]-v[2]*e[2],
                           -n[0]*e[0]-n[1]*e[1]-n[2]*e[2], 1.0];

    var modelviewMatrixInverseTranspose = [u[0], v[0], n[0], e[0],
                                           u[1], v[1], n[1], e[1],
                                           u[2], v[2], n[2], e[2],
                                            0.0,  0.0,  0.0,  1.0];

    var modelviewMatrixLocation = gl.getUniformLocation(chairShaderProgram, "M");
    gl.uniformMatrix4fv(modelviewMatrixLocation, false, modelviewMatrix);

    var modelviewMatrixInverseTransposeLocation = gl.getUniformLocation(chairShaderProgram, "M_inversetranspose");
    gl.uniformMatrix4fv(modelviewMatrixInverseTransposeLocation, false, modelviewMatrixInverseTranspose);


// projection matrix
    var left = -40.0;
    var right = 50.0;
    var top_ = 60.0;
    var bottom = -50.0;
    var near = 40.0;
    var far = 100.0;



// perspective projection matrix
    var perspectiveProjectionMatrix =
    [2.0*near/(right-left), .0, .0, .0,
     .0, 2.0*near/(top_-bottom), .0, .0,
     (right+left)/(right-left), (top_+bottom)/(top_-bottom), -(far+near)/(far-near), -1.0,
     .0, .0, -2.0*far*near/(far-near), .0];


    var perspectiveProjectionMatrixLocation = gl.getUniformLocation(chairShaderProgram, "P_persp");
     gl.uniformMatrix4fv(perspectiveProjectionMatrixLocation, false, perspectiveProjectionMatrix);

    //Light One
     var kaloc = gl.getUniformLocation(chairShaderProgram, "ka");
     var kdloc = gl.getUniformLocation(chairShaderProgram, "kd");
     var ksloc = gl.getUniformLocation(chairShaderProgram, "ks");
     gl.uniform3f( kaloc, 0.5, 0.5, 0.5);
     gl.uniform3f( kdloc, 0.5, 0.5, 0.5);
     gl.uniform3f( ksloc, 1.0, 1.0, 1.0);
     var alphaloc = gl.getUniformLocation(chairShaderProgram, "alpha");
     gl.uniform1f(alphaloc, 4.0);

     var p0loc = gl.getUniformLocation(chairShaderProgram, "p0");
     gl.uniform3f(p0loc, -40.0, 50.0, -15.0);

     var Ialoc = gl.getUniformLocation(chairShaderProgram, "Ia");
     var Idloc = gl.getUniformLocation(chairShaderProgram, "Id");
     var Isloc = gl.getUniformLocation(chairShaderProgram, "Is");
     gl.uniform3f( Ialoc, 0.1, 0.1, 0.1);
     gl.uniform3f( Idloc, 0.8, 0.8, 0.5);
     gl.uniform3f( Isloc, 0.8, 0.8, 0.8);

     //Light Two
     var kaloc2 = gl.getUniformLocation(chairShaderProgram, "ka2");
     var kdloc2 = gl.getUniformLocation(chairShaderProgram, "kd2");
     var ksloc2 = gl.getUniformLocation(chairShaderProgram, "ks2");
     gl.uniform3f( kaloc2, 0.5, 0.5, 0.5);
     gl.uniform3f( kdloc2, 0.5, 0.5, 0.5);
     gl.uniform3f( ksloc2, 1.0, 1.0, 1.0);
     var alphaloc2 = gl.getUniformLocation(chairShaderProgram, "alpha2");
     gl.uniform1f(alphaloc2, 4.0);

     var p0loc2 = gl.getUniformLocation(chairShaderProgram, "p0_2");
     gl.uniform3f(p0loc2, 50.0, 30.0, -5.0);

     var Ialoc2 = gl.getUniformLocation(chairShaderProgram, "Ia2");
     var Idloc2 = gl.getUniformLocation(chairShaderProgram, "Id2");
     var Isloc2 = gl.getUniformLocation(chairShaderProgram, "Is2");
     gl.uniform3f( Ialoc2, 0.1, 0.1, 0.1);
     gl.uniform3f( Idloc2, 0.8, 0.8, 0.5);
     gl.uniform3f( Isloc2, 0.8, 0.8, 0.8);

     gl.uniform1i(gl.getUniformLocation(chairShaderProgram,"texMap0"), 0);
    gl.drawElements( gl.TRIANGLES, chairFaces , gl.UNSIGNED_SHORT, 0 );

}


function transform(event){
    var theKeyCode = event.keyCode;
        if(theKeyCode == 90) {
            transX_func();
        } else if(theKeyCode == 88){
            negative_transX_func();
        }
}

function transX_func() {
    gl.useProgram(chairShaderProgram);
	transX -= .1;
	var transX_uniform = gl.getUniformLocation( chairShaderProgram, "transX" );
	gl.uniform1f( transX_uniform, transX );
}

function negative_transX_func() {
    gl.useProgram(chairShaderProgram);
	transX += .1;
	var transX_uniform = gl.getUniformLocation( chairShaderProgram, "transX" );
	gl.uniform1f( transX_uniform, transX );
}

function configureTexture( image ) {
    textureImage = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, textureImage );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
	gl.generateMipmap( gl.TEXTURE_2D );
}
