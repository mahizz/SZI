#include <SFML/Graphics.hpp>
#include <time.h>
#include <iostream>
#include <stdio.h>
#include "ResourcePath.hpp"
using namespace sf;

int ts = 70; //tile size
Vector2i offset(48,24);

struct piece
{ int x,y,col,row,kind,match,alpha;
    piece(){match=0; alpha=255;}
} grid[10][10];

class actor
{
public:
    int x,y,w,h;
    bool life;
    std::string name;
    Sprite sprite;
    int offset_x,offset_y;
    
    actor(Texture &t,int x, int y, int w, int h)
    {
        offset_x =30,
        offset_y =5;
        this->x =x;
        this->y =y;
        sprite.setTexture(t);
        //sprite.setOrigin(w/2,h/2);
    }
    void draw(RenderWindow &app)
    {
        //sprite.setPosition(x,y);
        // sprite.setTextureRect( IntRect(40,0,40,40));
        //gems.setColor(Color(255,255,255,p.alpha));
        sprite.setPosition(x,y);
        app.draw(sprite);
    }
    
    void update(int x, int y)
    {
        this->x =x+offset_x;
        this->y =y+offset_y;
    }
    
};

int main()
{
    srand(time(0));
    RenderWindow app(VideoMode(800,600), "Kratka");
    app.setFramerateLimit(60);

    Texture t1,t2,t3;
    t1.loadFromFile(resourcePath() + "background.png");
    t2.loadFromFile(resourcePath() + "56.png");
    t3.loadFromFile(resourcePath() + "actor.png");
    
    Sprite background(t1), gems(t2) ,some(t3);
    
    
    //*act->img = some;
    for (int i=1;i<=8;i++)
        for (int j=1;j<=8;j++)
        {
            grid[i][j].col=j;
            grid[i][j].row=i;
            grid[i][j].x = j*ts;
            grid[i][j].y = i*ts;
        }
    actor *act = new actor(t3,grid[3][3].x,grid[3][3].y,35,35);
    
    int x0,y0,x,y; int click=0; Vector2i pos;
    bool isSwap=false, isMoving=false;
    
    while (app.isOpen())
    {
        Event e;
        while (app.pollEvent(e))
        {
            if (e.type == Event::Closed)
                app.close();
            
            if (e.type == Event::KeyPressed){
                if (Keyboard::isKeyPressed(Keyboard::Right)) ;
                if (Keyboard::isKeyPressed(Keyboard::Left))  ;
                if (Keyboard::isKeyPressed(Keyboard::Up))    ;
            }
            
            if (e.type == Event::MouseButtonPressed)
                if (e.key.code == Mouse::Left)
                {
                    pos = Mouse::getPosition(app)-offset;
                    act->update(pos.x,pos.y);
                    printf("Pos X: %d", pos.x);
                    printf("Pos Y: %d", pos.y);
                }
            
        }
        app.draw(background);
        
        for (int i=1;i<=8;i++)
            for (int j=1;j<=8;j++)
            {
                piece p = grid[i][j];
                gems.setTextureRect( IntRect(49,0,49,49));
                //gems.setColor(Color(255,255,255,p.alpha));
                gems.setPosition(p.x,p.y);
                gems.move(offset.x-ts,offset.y-ts);
                
                app.draw(gems);
                act->draw(app);
            }
        
        app.display();
    }
    return 0;
}
