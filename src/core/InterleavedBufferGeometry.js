/**
 * var attributes = [
 *  {name: "position", itemSize: 3},
 *  {name: "normal", itemSize: 3},
 *  {name: "uv", itemSize: 2},
 *  {name: "uv2", itemSize: 2}
 *];
 * 
 *
 */
THREE.InterleavedBufferGeometry = function(attributes, array) {
    Object.defineProperty( this, 'id', { value: THREE.GeometryIdCount ++ } );

    this.name = '';
    this.type = 'InterleavedBufferGeometry';

    this.attributes = attributes;
    this.array = array;

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
    // TODO for Culling
    //this.boundingBox = null;
    //this.boundingSphere = null;
};

THREE.InterleavedBufferGeometry.prototype = {
    constructor: THREE.InterleavedBufferGeometry
};

THREE.EventDispatcher.prototype.apply( THREE.InterleavedBufferGeometry.prototype );
