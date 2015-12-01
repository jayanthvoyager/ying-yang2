var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
var b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;
var b2AABB = Box2D.Collision.b2AABB;

var canvasWidth=1024,canvasHeight=800;
var world;
var score=0 ;
var scale=30;
var timeStep=1/60;
var vel=8;
var pos=3;

var mX,mY,sM,mJ,ismouseDown;

var can;
var context;
var canvaspos;


var ballImg1=new Image();
ballImg1.src="unnamed.png";
ballImg1.onload=function()
{
	console.log("Player Loaded");
};



var ballImg=new Image();
ballImg.src="ball.png";
ballImg.onload=function()
{
	console.log("Ball Loaded");
};
var balls=new Array();

var fix=new b2FixtureDef;
	fix.density=0.0;
	fix.friction=0.0;
	fix.restitution=1;

function count_rabbits() {
    
        alert("You scored "+score+" Points")
    
}



function init()
{
	var gravity=new b2Vec2(0,0);//for changing gravity
	var allowSleep=true;
	
	world=new b2World(gravity,allowSleep);
	
	can=document.getElementById("main");
	context=can.getContext("2d");
	canvaspos=getElementPosition(can);
	console.log(canvaspos);
	createFloor();
	createFloorhorizontaltop();
	createFloorvertical(590,300);	

	createFloorvertical(10,300);

	//createRect(40,20,30,80);
	//createRect(123,20,50,20);
	//createRect(286,20,10,40);
	//createRect(367,20,60,30);
	
	createCircle(222,20,30);
	createCircle(23,20,30);
	createCircle(412,20,30);
	createCircle(390,20,30);
	createPlayer();
checkCollision();

	Draw();
	createBalls();
		
		

	animate();
}

var floorBody;

function createBalls()
{
	//var body=new Array();
    
	for (i=0;i<5;i++)
	{
		var body=new b2BodyDef;
		body.type=b2Body.b2_dynamicBody;
		body.position.x=(Math.random()*600)/scale;
		body.position.y=(Math.random()*600)/scale;
		
		fix.shape=new b2CircleShape(22.5/scale);
		
		
		balls[i]=world.CreateBody(body);
		balls[i].SetUserData({name:"points",life:1000});
		var fixe=balls[i].CreateFixture(fix);
	}
	
}



function createFloor()
{
	var floor=new b2BodyDef;
	floor.type=b2Body.b2_staticBody;
	floor.position.x=600/2/scale;
	floor.position.y=590/scale;
		
	fix.shape=new b2PolygonShape;
	fix.shape.SetAsBox(300/scale,10/scale);
	
	floorBody=world.CreateBody(floor);
	var floorFix=floorBody.CreateFixture(fix);
	
}
function createFloorhorizontaltop()
{
	var floor=new b2BodyDef;
	floor.type=b2Body.b2_staticBody;
	floor.position.x=600/2/scale;
	floor.position.y=0/scale;
		
	fix.shape=new b2PolygonShape;
	fix.shape.SetAsBox(300/scale,10/scale);
	
	floorBody=world.CreateBody(floor);
	var floorFix=floorBody.CreateFixture(fix);
	
}


function createFloorvertical(posx,posy)
{
	var floor=new b2BodyDef;
	floor.type=b2Body.b2_staticBody;
	floor.position.x=posx/scale;
	floor.position.y=posy/scale;
	
	var fix=new b2FixtureDef;
	fix.density=0.0;
	fix.friction=0.0;
	fix.restitution=1.0;
	
	fix.shape=new b2PolygonShape;
	fix.shape.SetAsBox(10/scale,300/scale);
	
	var floorBody=world.CreateBody(floor);
	var floorFix=floorBody.CreateFixture(fix);
	
}


function Draw()
{
	//can=document.getElementById("main");
	//context=can.getContext("2d");
	
	var bodyDraw=new b2DebugDraw;
	bodyDraw.SetSprite(context);
	bodyDraw.SetDrawScale(scale);
	bodyDraw.SetFillAlpha(0.3);
	bodyDraw.SetLineThickness(1.0);
	bodyDraw.SetFlags(b2DebugDraw.e_shapeBit|b2DebugDraw.e_jointBit);
	
	world.SetDebugDraw(bodyDraw);
}

var timeStep=1/60;
var velocityIterations=8;
var positionIterations=3;

function animate()
{
	//canvaspos=getElementPosition(document.getElementById("main"));
	
	if(ismouseDown && (!mJ))
	{
		var body=getBodyAtMouse();
		if(body)
		{
			var md=new b2MouseJointDef();
			md.bodyA=floorBody;
			md.bodyB=body;
			md.target.Set(mX,mY);
			md.collideConnected=true;
			md.maxForce=300.0*body.GetMass();
			mJ=world.CreateJoint(md);
			body.SetAwake(true);
		}
	}
	
	if(mJ)
	{
		if(ismouseDown)
		{
			mJ.SetTarget(new b2Vec2(mX,mY));
		}
		else
		{
			world.DestroyJoint(mJ);
			mJ=null;
		}
	}
	
		
	world.Step(timeStep,velocityIterations,positionIterations);
	world.ClearForces();
	if(player && player.GetUserData().life<=0)
	{
count_rabbits() ;
		world.DestroyBody(player);
		player=undefined;
		console.log("Player Done");
	}

	world.DrawDebugData();

	for(i=0;i<5;i++)
	{
		var pos1=balls[i].GetPosition();
		
		
			context.save();
			context.translate(pos1.x*scale,pos1.y*scale);
			context.rotate(balls[i].GetAngle());
			context.drawImage(ballImg,-22.5,-22.5);
			context.restore();
		
	}

var playerpos=player.GetPosition();
context.save();
			context.translate(playerpos.x*scale,playerpos.y*scale);
			context.rotate(player.GetAngle());
			context.drawImage(ballImg1,-33.5,-33.5);
			context.restore();
	setTimeout(animate,timeStep);
}

function createRect(x,y,w,h)
{
	var rect=new b2BodyDef;
	rect.type=b2Body.b2_dynamicBody;
	rect.position.x=x/scale;
	rect.position.y=y/scale;
	
	fix.shape=new b2PolygonShape;
	fix.shape.SetAsBox(w/scale,h/scale);
	
	var rectBody=world.CreateBody(rect);
	var fixRect=rectBody.CreateFixture(fix);
}







function handlemouseDown(e)
{
	ismouseDown=true;
	handleMouseMove(e);
	document.addEventListener("mousemove",handleMouseMove,true);
}

document.addEventListener("mousedown",handlemouseDown,true);

function handleMouseUp()
{
	document.removeEventListener("mousemove",handleMouseMove,true);
	
	ismouseDown=false;
	mX=undefined;
	mY=undefined;
}

//document.addEventListener("mouseup",handleMouseUp,true);

function handleMouseMove(e)
{
	var cX,cY;
	if(e.clientX)
	{
		cX=e.clientX;
		cY=e.clientY;
	}
	else{
		return;
	}
	
	
	mX=(cX- canvaspos.x)/30;
	//console.log(canvaspos.x,canvaspos.y);
	
	mY=(cY- canvaspos.y)/30;
	//console.log(mX,mY);
	//console.log(canvaspos.x,canvaspos.y);
	
	//mX=cX/scale;
	//mY=cY/scale;
	//console.log(mX,mY);
	
	e.preventDefault();
}

var mousePVec;
function getBodyAtMouse()
{
	mousePVec=new b2Vec2(mX,mY);
	var aabb=new b2AABB();
	
	aabb.lowerBound.Set( mX - 0.000001, mY - 0.000001);
	aabb.upperBound.Set( mX + 0.000001, mY + 0.000001);
	//console.log(mousePVec);
	//console.log(aabb.lowerBound,aabb.upperBound);
	sM=null;
	world.QueryAABB(getBodyCB,aabb);
	//console.log(sM);
	return sM;
}

function getBodyCB(fixture)
{
	//console.log("Buddy Please Work . . . ");
	if(fixture.GetBody().GetType() != b2Body.b2_staticBody)
	{
		//console.log("I am In :-)");
		if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(),mousePVec))
		{
			console.log("I am In :-)");
			sM=fixture.GetBody();
			//console.log(sM);
			return false;
		}
	}
	return true;
}


function getElementPosition(element)
{
	var elem=element;
	var x=0,y=0;
	var tagname="";
	
	//console.log(elem);
	while((typeof(elem) == "object") && (typeof(elem.tagName)!= "undefined" ))
	{
		y+=elem.offsetTop;
		x+=elem.offsetLeft;
		tagname=elem.tagName.toUpperCase();
		
		if(tagname=="BODY")
			elem=0;
		
		if(typeof(elem)=="object")
		{
			if(typeof(elem.offsetParent)=="object")
			{
				elem=elem.offsetParent;
			}
		}
		return{x:x,y:y};
	}
}
var circleBody;
function createCircle(x,y,r)
{
	var circle=new b2BodyDef;
	circle.type=b2Body.b2_dynamicBody;
	circle.position.x=x/scale;
	circle.position.y=y/scale;
	
	fix.shape=new b2CircleShape(r/scale);
	
	circleBody=world.CreateBody(circle);
circleBody.SetUserData({name:"enemy",life:1000});

	var circleFix=circleBody.CreateFixture(fix);
}

var player;
function createPlayer()	
{
	var body=new b2BodyDef;
	body.type=b2Body.b2_dynamicBody;
	body.position.x=300/scale;
	body.position.y=80/scale;
	
	var fix=new b2FixtureDef;
	fix.density=1.0;
	fix.friction=0.3;
	fix.restitution=0.7;
	
	fix.shape=new b2CircleShape(30/scale);
		
	player=world.CreateBody(body);
	player.SetUserData({name:"Player",life:10});
	var fixPlayer=player.CreateFixture(fix);
	
}

function checkCollision()
{
	var listener=new Box2D.Dynamics.b2ContactListener;
	listener.PostSolve=function(contact,impulse)
	{
		var body1=contact.GetFixtureA().GetBody();
		var body2=contact.GetFixtureB().GetBody();
		
		if(body1==player && body2==player)
		{

		}

	if(body1==circleBody|| body2==circleBody)
		{var imp=impulse.normalImpulses[0];
                 player.GetUserData().life-=imp;
console.log("The Impulse is " +imp + " and the life is " + player.GetUserData().life);
 		}


for(i=0;i<5;i++)
	{
for(j=0;j<5;j++)
	{

	if(body1==balls[i] && body2==balls[j])
		{
              
			score+=1;
                console.log("The Score is " +score);
           }
}
}
	};
	world.SetContactListener(listener);
}




