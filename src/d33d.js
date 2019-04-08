function update_color(cv) {
    var circs = d3.select('#ImageComp').select('svg').selectAll('g')
                  .selectAll('circle')["_groups"][0]
    for (var i = 0; i < cv.length; i++) {
        circs[i].setAttribute('fill', d3.color(cv[i]))
    }
}

function makePlot(indata, compid, figwidth, cv) {

    var scale = 2
    var scatter = [], beta = 0, alpha = 0
    var startAngle = 133, startAngle2  = 35
    var mx, my, mouseX, mouseY;

    d3.select('#'+compid).select("svg").remove()
    var svg = d3.select('#'+compid).append("svg")
        .attr("width",  figwidth)
        .attr("height", figwidth)
        .attr("class", compid)
        .style("shape-rendering", "geometricPrecision")
        .call(
            d3.drag()
            .on('drag', dragged)
            .on('start', dragStart)
            .on('end', dragEnd)
        ).append('g')

    var point3d = d3._3d()
        .x(function(d){ return d.x; })
        .y(function(d){ return d.y; })
        .z(function(d){ return d.z; })
        .origin([figwidth/2,  figwidth/2])
        .rotateX(startAngle)
        .rotateY(startAngle2)
        .scale(scale);


    for (var i = 0; i < indata.length; i++) {    
        scatter.push({x: indata[i][0], y: indata[i][2], z: indata[i][1],
                      id: 'point_' + i, vc: d3.color(cv[i])})
    }
    processData([point3d(scatter)], 0);

    function posPointX(d){
        return d.projected.x;
    }

    function posPointY(d){
        return d.projected.y;
    }

    function processData(data, tt){
        var points = svg.selectAll('circle').data(data[0], function(d){ return d.id; });
        points
            .enter()
            .append('circle')
            .merge(points)
            .attr('r', 4)
            .attr('stroke', function(d){ return d.vc.darker(2) })
            .attr('fill', function(d){ return d.vc })
            .attr('opacity', 0.7)
            .attr('cx', posPointX)
            .attr('cy', posPointY)
        points.exit().remove()
    }

    function dragStart(){
        mx = d3.event.x;
        my = d3.event.y;
    }

    function dragged(){
        mouseX = mouseX || 0;
        mouseY = mouseY || 0;
        beta   = (d3.event.x - mx + mouseX) * Math.PI / -150 ;
        alpha  = (d3.event.y - my + mouseY) * Math.PI / 250  * (-1);
        var data = [
            point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle2)(scatter),
        ];
        processData(data, 0);
    }

    function dragEnd(){
        mouseX = d3.event.x - mx + mouseX;
        mouseY = d3.event.y - my + mouseY;
    }
}

export {
    makePlot,
    update_color
}