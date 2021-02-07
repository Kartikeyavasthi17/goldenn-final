var play;
var gameState =0;
var backgroundColor ="black";
var playImg;
var backgroundCastle 
var player,playerImg;
var ground,invisibleGround;
var enemyGroup;
var friendsImg;
var FriendsGroup;
var bombGroup;
var create_team_mem = 0;

var player_change;
var attack =false

var ObstaclesGroup;
var edges;

var score=0;

var fr_index =0;

var obstacleImg;

console.log("var")

var skeletonImg,skeleton;

var restartImg;

var restart;

var FriendsTeam =[];

var bomb,bombImg;

function preload()
{
  console.log("preload")
  skeletonImg =loadImage("skeleton.png")
  playImg =loadImage("play.png")
  friendsImg =loadImage("among.png")
  backgroundCastle =loadImage("castle.png");
  playerImg =loadImage("newplayer.png");
  player_change = loadImage("player1.png");
  obstacleImg = loadImage("obstacle.png");
  restartImg = loadImage("restart.png");
  bombImg = loadImage("download.png")
}

function setup() {
  createCanvas(3000,400);

  console.log("setup");

  play =createSprite(width/2-850,height/2,60,20);
  play.addImage(playImg);
  play.visible =false;

  restart =createSprite(width/2,height/2,60,20)
  restart.addImage(restartImg);
  restart.visible =false;

  player =createSprite(200,360,20,50);
  player.addImage(playerImg)

  player.setCollider("circle",0,0,100);
  player.debug =true;
 
  player.scale = 0.5;
  player.x = 50;

  ground = createSprite(200,360,2800,20);
  ground.visible =false;

  invisibleGround =createSprite(800,390,6000,20)
  invisibleGround.visible =true;

  edges =createEdgeSprites();

  ObstaclesGroup = createGroup();
  FriendsGroup = createGroup();

}
function draw() {


  if(gameState === 0)
  {
    console.log("start")
    play.visible =true;

    background("black");
    
    if(mousePressedOver(play))
    {
      gameState = 1;
    }
  }

  if(gameState === 1)
  {
    background(backgroundColor);  
    play.visible =false;
    backgroundColor =backgroundCastle;
    text("Score="+score,1400,100);
    textSize(15);
    
    if(keyDown(RIGHT_ARROW))
    {
      player.x =player.x +5;
    }

    if(keyDown(LEFT_ARROW))
    {
      player.x =player.x -5;
    } 

    if(keyDown(UP_ARROW) && player.y >= 300)
    {
      player.velocityY =-10;
    }

    player.velocityY +=0.5;

    ConnectTeam();

    if(player.x <1600)
    {
      spawnFriends();
      spwanObstacles();
      friendsDestory();

      if(ObstaclesGroup.isTouching(player))
      {
        TeamDestroy()
      }
    }

    else if(player.x> 1600)
    {
      skeleton =createSprite(2400,340,10,10);
      skeleton.scale =0.5;
      skeleton.addImage(skeletonImg);

      enemyAttack();

      if(attack)
      {
      if(player.isTouching(bomb))
      {
        TeamDestroy();
      }
    }
  }
  }
  
  console.log(player.x);

  if(gameState === 3)
  {
    restart.visible =true;

    player.velocityY =0;
    ObstaclesGroup.setVelocityEach(0);
    FriendsGroup.setVelocityEach(0);

    background(backgroundColor);  

    if(mousePressedOver(restart))
    {
      reset();
    }

    ObstaclesGroup.setLifetimeEach(-1);
    FriendsGroup.setLifetimeEach(-1);
  }
 
   player.collide(edges[0]);
   player.collide(edges[1]);
  player.collide(invisibleGround);

  drawSprites();

}

function spwanObstacles()
{
  if(frameCount%20000 === 0)
  {
  var obstacle =createSprite(1600,random(200,380),30,30);
  obstacle.addImage(obstacleImg);
  obstacle.debug =true;
  obstacle.velocityX =random(-4,-9);
  obstacle.lifetime =400;
  obstacle.scale =0.5;

  obstacle.setCollider("rectangle",0,10,100,100);

  player.depth =obstacle.depth;
  obstacle.depth +=1;

  ObstaclesGroup.add(obstacle);
  
  }
}

function spawnFriends()
{
  if(frameCount%400 === 0)
  {
      
    var friends =createSprite(random(600,1300),350,30,30);
    friends.addImage(friendsImg);
    friends.setCollider("rectangle",0,0,200,200);
  

    friends.scale =0.10;

    friends.depth = player.depth;
    FriendsGroup.add(friends);
  
  }
}


function ConnectTeam(){

  if(player.isTouching(FriendsGroup))
  {
  
    for(var i =0; i < FriendsGroup.length; i++)
    {
        if(FriendsGroup.get(i).isTouching(player))
        {
          FriendsGroup.get(i).addImage(player_change);
          FriendsGroup.get(i).scale = 0.6; 
          create_team_mem = 1;  
          score =score+1;
          FriendsGroup.get(i).remove();
        }
      }
  }

  if(create_team_mem === 1)
  {
    FriendsTeam[fr_index] =createSprite(500,300,30,30);
    FriendsTeam[fr_index].addImage(player_change);
    create_team_mem = 0;
    fr_index = fr_index+1;
  }
  for(var i =0; i<FriendsTeam.length; i++)
  {
   FriendsTeam[i].x =player.x -(i*50+50);
   FriendsTeam[i].y =player.y;
  }


}

function friendsDestory()
{

    for(var i =0; i < FriendsGroup.length; i++)
    {
      for(var j =0; j < ObstaclesGroup.length; j++)
      {
        if(FriendsGroup.length > 0 && ObstaclesGroup.length > 0)
        {
        if(FriendsGroup.get(i).isTouching(ObstaclesGroup.get(j)))
        {
          console.log("2");
          FriendsGroup.get(i).remove();
        }
     // }
  }
}
}
}

function TeamDestroy()
{
  if(FriendsTeam.length > 0)
  {
      FriendsTeam[length].remove();
  }
  else if(FriendsTeam.length === 0)
  {
    gameState =3
  }
}

function reset()
{
  gameState =0;

  restart.visible =false;

  player.x =200;

  ObstaclesGroup.destroyEach();
  FriendsGroup.destroyEach();

  score =0;
}

function enemyAttack()
{
  if(frameCount%100 === 0)
  {
    bomb =createSprite(skeleton.x,350,10,10);
    bomb.addImage(bombImg)
    bomb.scale =0.5;
    bomb.velocityX =-5;
   // bombGroup.add(bomb);
    attack =true;
  }
}
