/**
 * var attributes = [
 *  {name: "position", itemSize: 3},
 *  {name: "normal", itemSize: 3},
 *  {name: "uv", itemSize: 2},
 *  {name: "uv2", itemSize: 2}
 *]; => Float32Array
 *
 * var index = [0, 1, 2,..] => UInt16/32Array
 */
THREE.InterleavedBufferGeometry = function(attributes, array, indices) {
    Object.defineProperty( this, 'id', { value: THREE.GeometryIdCount ++ } );

    this.name = '';
    this.type = 'InterleavedBufferGeometry';

    this.attributes = attributes;
    this.array = array;
    this.offsets = [];

    if(indices) {
        this.index = {
            array: indices
        };
    }

    if(attributes.length > 1){
        var stride = this.stride = attributes.map(function(a) { return a.itemSize; }).reduce(function(a, b) { return a + b; }, 0);
        this.count = this.array.length / this.stride;
    } else {
        var stride = 0;
        this.count = this.array.length / attributes[0].itemSize;
    }

    var offset = 0;
    var attributeLocation = 0;

    attributes.forEach(function(attribute) {
        attribute.location = attributeLocation++;
        attribute.offset = offset
        attribute.stride = attributes.length > 1 ? stride : 0;
        offset += attribute.itemSize
    });

    this.boundingBox = null;
    this.boundingSphere = null;
};

THREE.InterleavedBufferGeometry.prototype = {
    constructor: THREE.InterleavedBufferGeometry,

    computeBoundingBox: function () {

        var vector = new THREE.Vector3();

        return function () {

            if ( this.boundingBox === null ) {

                this.boundingBox = new THREE.Box3();

            }

            var bb = this.boundingBox;
            bb.makeEmpty();

            if(this.stride === 0) {
                var step = 3;
            } else {
                var step = this.stride - 3 - 1;
            }

            for ( var i = 0, il = this.array.length; i < il; i += step ) {

                vector.set( this.array[ i ], this.array[ i + 1 ], this.array[ i + 2 ] );
                bb.expandByPoint( vector );

            }



            if ( isNaN( this.boundingBox.min.x ) || isNaN( this.boundingBox.min.y ) || isNaN( this.boundingBox.min.z ) ) {

                console.error( 'THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.' );

            }

        }
    }(),


    computeBoundingSphere: function () {

        var box = new THREE.Box3();
        var vector = new THREE.Vector3();

        return function () {

            if ( this.boundingSphere === null ) {

                this.boundingSphere = new THREE.Sphere();

            }


            box.makeEmpty();

            if(this.stride === 0) {
                var step = 3;
            } else {
                var step = this.stride - 3 - 1;
            }

            var center = this.boundingSphere.center;

            for ( var i = 0, il = this.array.length; i < il; i += step ) {

                vector.set( this.array[ i ], this.array[ i + 1 ], this.array[ i + 2 ] );
                box.expandByPoint( vector );

            }

            box.center( center );

            // hoping to find a boundingSphere with a radius smaller than the
            // boundingSphere of the boundingBox:  sqrt(3) smaller in the best case

            var maxRadiusSq = 0;

            for ( var i = 0, il = this.array.length; i < il; i += step ) {

                vector.set( this.array[ i ], this.array[ i + 1 ], this.array[ i + 2 ] );
                maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( vector ) );

            }

            this.boundingSphere.radius = Math.sqrt( maxRadiusSq );

            if ( isNaN( this.boundingSphere.radius ) ) {

                console.error( 'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.' );

            }

        }

    }()
};

THREE.EventDispatcher.prototype.apply( THREE.InterleavedBufferGeometry.prototype );
