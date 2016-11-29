//function preload() { startGibber() }

function setup() {
  var canvas = createCanvas(windowWidth / 2, windowHeight)
  canvas.parent("output");

  drums = EDrums( 'x*o*x*o-' )
  
  sampler = Sampler().record( drums, 1 )
    .note.seq( [.25,.5,1,2].rnd(), [1/4,1/8,1/2].rnd() )
    .fx.add( Delay(1/64))
    .pan.seq( Rndf(-1,1) )

  bass = Mono('bass')
    .note.seq( [0,7], 1/8 )

  Gibber.scale.root.seq( ['c4','eb4'], 1 )
  
  follow = Follow( Gibber.Master, 1024 )
  
  background( 64 )
  noFill()
  stroke( 10,0,0,127 )
}

function draw() {
  var x = mouseX / width,
      y = mouseY / height,
      ww2 = width / 2,
      wh2 = height / 2,
      value = follow.getValue(),
      radius = ( ww2 > wh2 ? wh2 : ww2 ) * value
      
  bass.resonance = (1 - x) * 5      
  bass.cutoff = (1 - y) / 2
  
  sampler.fx[0].feedback = x < .99 ? x : .99
  
  strokeWeight( value * 50 )
  background( 64,64,64,10 )
  ellipse( ww2, wh2, radius, radius )
}
