function decrease_speed2(){
    if(player.game_type === "single_player")
    {
        decrease_speed1();
    }
    else
    {
        decrease_speed();
    }
}
function increase_speed2(){
    if(player.game_type === "single_player")
    {
        increase_speed1();
    }
    else
    {
        increase_speed();
    }
}
function fire2(){
    if(player.game_type === "single_player")
    {
        fire1();
    }
    else
    {
        fire();
    }
}
function decrease_angle2(){
    if(player.game_type === "single_player")
    {
        decrease_angle1();
    }
    else
    {
        decrease_angle();
    }
}
function increase_angle2(){
    if(player.game_type === "single_player")
    {
        increase_angle1();
    }
    else
    {
        increase_angle();
    }
}
function decrease_movement_backward2(){
    if(player.game_type === "single_player")
    {
        decrease_movement_backward1();
    }
    else
    {
        decrease_movement_backward();
    }
}
function decrease_movement_forward2(){
    if(player.game_type === "single_player")
    {
        decrease_movement_forward1();
    }
    else
    {
        decrease_movement_forward();
    }
}