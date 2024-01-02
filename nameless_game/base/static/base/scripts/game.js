// Things to keep around
location_display = $("#location")[0]
move_buttons = $(".move_button")
path_buttons = $(".path_button")
current_location = [0, 0]
center = 27*13+13
current = center
/* For use in potential dynamic sizing later...*/
width = 27
height = 27
/* For use in potential dynamic sizing later...*/
/* For click-to-move tracking */
row = 13
column = 13
/* For click-to-move tracking */
generating_map = true
exit = -1 // arbitrary for logic...don't worry about it...
mobs = {}

// get mobs from HTML
function get_mobs(){
     if(document.getElementById('mobs')){
          mobs = JSON.parse(document.getElementById('mobs').textContent)
     }
     else{
          setTimeout(100, get_mobs)
          return;
     }
}

// this is so bad...laziest...way...to do this...ever...
function load_tiles(){
     for(i = 0; i < height; i++){
          $("#tiles").append("<div class='tile_row'></div>")
     }
     $(".tile_row").each(function( index ){
          for(i = 0; i < width; i++){
               /* NOTES ICON - USE WHEN READY? Needs styling... */
               //$(this).append("<div class='tile'><i class='gg-notes'></i></div>")
               $(this).append("<div class='tile' id=" + ((index * 27) + i) + "></div>")
          }
     })

     return void 0;
}

// because why not do it twice...
function load_journal(){
     for(i = 0; i < width*height; i++){
          $("#journal_container").append(
               "<div class='journal_entry_label'><p style='margin: unset'>&nbsp</p><div class='journal_entry hidden_entry " + i + "'><textarea readonly></textarea></div></div>"
          )
     }
     return void 0;
}

function bind_move(){
     move_buttons.each(function(){
          $(this).on('click', function(){
               // hard coded, gross but temporary?
               // just...try to move...
               if(this.id === "up"){
                    if(current - 27 < 0){
                         alert("Stop trying to go off the map...")
                         return void 0;
                    }

                    if($($(".tile")[current]).css("border-top-color") == "rgb(0, 0, 0)"){// oh god why..."black")
                         alert("Can't move through walls (yet...)");
                         return void 0;
                    }

                    new_loc = current - 27
                    current_location[1] = current_location[1] + 1
                    $($(".tile")[new_loc]).css("border-bottom-color", "white")
                    $($(".tile")[current]).css("border-top-color", "white")
                    $($(".tile")[new_loc]).addClass("seen in")
               }
               else if(this.id === "down"){
                    if(current + 27 >= (27 * 27)){
                         alert("Stop trying to go off the map...")
                         return void 0;
                    }

                    if($($(".tile")[current]).css("border-bottom-color") == "rgb(0, 0, 0)"){// oh god why..."black")
                         alert("Can't move through walls (yet...)");
                         return void 0;
                    }

                    new_loc = current + 27
                    current_location[1] = current_location[1] - 1
                    $($(".tile")[new_loc]).css("border-top-color", "white")
                    $($(".tile")[current]).css("border-bottom-color", "white")
                    $($(".tile")[new_loc]).addClass("seen in")
               }
               else if(this.id === "left"){
                    if(current % 27 === 0){
                         alert("Stop trying to go off the map...")
                         return void 0;
                    }

                    if($($(".tile")[current]).css("border-left-color") == "rgb(0, 0, 0)"){// oh god why..."black")
                         alert("Can't move through walls (yet...)");
                         return void 0;
                    }

                    new_loc = current - 1
                    current_location[0] = current_location[0] - 1
                    $($(".tile")[new_loc]).css("border-right-color", "white")
                    $($(".tile")[current]).css("border-left-color", "white")
                    $($(".tile")[new_loc]).addClass("seen in")
               }
               else{ //clicked "right"
                    if(current % 27 === 26){ //why am i like this...
                         alert("Stop trying to go off the map...")
                         return void 0;
                    }

                    if($($(".tile")[current]).css("border-right-color") == "rgb(0, 0, 0)"){// oh god why..."black")
                         alert("Can't move through walls (yet...)");
                         return void 0;
                    }

                    new_loc = current + 1
                    current_location[0] = current_location[0] + 1
                    $($(".tile")[new_loc]).css("border-left-color", "white")
                    $($(".tile")[current]).css("border-right-color", "white")
                    $($(".tile")[new_loc]).addClass("seen in")
               }

               // did we win?
               switch($($(".tile")[new_loc]).data("event")){
                    // ignoring "empty" because...it's empty...
                    case "exit":
                         if(confirm("Exit Found! Reload?")){
                              window.location.reload();
                         } else {
                              alert("Game complete - reload to restart or keep exploring!")
                         }
                         break;
                    case "enemy":
                         combat($($(".tile")[new_loc]).data("enemy"))
                         break
                    case "heal":
                         break
                    case "treasure":
                         break
                    default:
                         break
               }

               $($(".tile")[new_loc]).css("background-color", "cyan")

               // update previous location and current value
               $($(".tile")[current]).css("background-color", "white")
               $($(".tile")[current]).removeClass("in")
               current = new_loc

               // update location location_display
               location_display.innerHTML = "Current Location: [" + current_location[0] + "," + " " + current_location[1] + "]"
               adjacent_tiles = {
                    "up": [current_location[0], current_location[1] + 1],
                    "down": [current_location[0], current_location[1] - 1],
                    "left": [current_location[0] + 1, current_location[1]],
                    "right": [current_location[0] - 1, current_location[1]]
               }

               journal_entry();

               // Just some play text...
               //$("#adjacent")[0].innerHTML = adjacent_tiles["up"] + "  " + adjacent_tiles["down"] + "  " + adjacent_tiles["left"] + "  " + adjacent_tiles["right"]

               // quick maths...
               /*
               console.log(current) // JUST A NUMBER
               console.log("column - " + current % 27) // COLUMN 0(left) - 26
               console.log("row - " + Math.floor(current / 27)) // ROW 0(top) -26
               */
          })
     })
}

function bind_paths(){
     path_buttons.each(function(){
          $(this).on('click', function(){
               switch(this.id){
                    case "p_open_up":
                         $($(".tile")[current]).css("border-top-color", "white");
                         break;
                    case "p_open_down":
                         $($(".tile")[current]).css("border-bottom-color", "white");
                         break;
                    case "p_open_left":
                         $($(".tile")[current]).css("border-left-color", "white");
                         break;
                    case "p_open_right":
                         $($(".tile")[current]).css("border-right-color", "white");
                         break;
                    case "p_close_up":
                         $($(".tile")[current]).css("border-top-color", "black");
                         break;
                    case "p_close_down":
                         $($(".tile")[current]).css("border-bottom-color", "black");
                         break;
                    case "p_close_left":
                         $($(".tile")[current]).css("border-left-color", "black");
                         break;
                    case "p_close_right":
                         $($(".tile")[current]).css("border-right-color", "black");
                         break;
                    default:
                         break;
               }
               /*
               if(this.id === "p_open_up"){
                    $($(".tile")[current]).css("border-top-color", "white");
               }
               else if(this.id === "p_open_down"){
                    $($(".tile")[current]).css("border-bottom-color", "white");
               }
               else if(this.id === "p_open_left"){
                    $($(".tile")[current]).css("border-left-color", "white");
               }
               else{ // clicked RIGHT
                    $($(".tile")[current]).css("border-right-color", "white");
               }
               */
          })
     })
}

function display_initial_location(){
     $($(".tile")[center]).css("background-color", "cyan")
     $($(".tile")[center]).addClass("seen in")
     $($(".tile")[center]).data("event", "empty")
}

ctm_message = "Are you sure you want to move instantly to the selected location?"
function bind_click_to_move(){
     $(".tile").each(function(){
          $(this).on('click', function(){
               if(current === parseInt(this.id)){
                    return void 0;
               }
               if(confirm(ctm_message) == true){
                    new_loc = parseInt(this.id)
                    // update new location
                    $($(".tile")[new_loc]).css("background-color", "cyan")
                    $($(".tile")[new_loc]).addClass("in")
                    // update previous location and current value
                    $($(".tile")[current]).css("background-color", "white")
                    $($(".tile")[current]).removeClass("in")
                    current = new_loc
                    // Let's do math! Location array calculations
                    new_row = Math.floor(current / 27) // 0 - 26, top is 0
                    new_column = current % 27 // 0 - 26, left is 0
                    // base [0, 0] = calculated 13
                    // SO!
                    current_location[0] = new_column - 13 //new_col bigger = bigger mod, we moved right. Subtract AFTER (right of start = positive)
                    current_location[1] = 13 - new_row //new_row bigger = bigger floor, we moved down. Subtract BEFORE (blow start = negative)
                    location_display.innerHTML = "Current Location: [" + current_location[0] + "," + " " + current_location[1] + "]"
               }

               journal_entry();
          })
     })
}

/* journal ARRAY, let j2t array tell us where to find entries */
// journal = [] // this is unecessary, textareas "save" themselves per page load
// journal_to_tile
j2t_map = []
entry_number = 0
function journal_entry(){
     // HIDE ALL entries
     $(".journal_entry").each(function(){
          $(this).addClass("hidden_entry")
          $(this).removeClass("exposed_entry")
          $(this).parent().removeClass("active")
          $(this).parent().css("display", "none") // keep the journal clean for the game
     })
     tile = $(".tile")[current].id
     // Okay...now check if an entry exists already...
     if(j2t_map.includes(tile)){
          // if it does, just reveal that particular journal entry
          entry_div = $('.journal_entry.' + j2t_map.indexOf(tile))
          entry_div.parent().css("display", "block")
          entry_div.parent().addClass("active")
          entry_div.removeClass("hidden_entry")
          entry_div.addClass("exposed_entry")
     }
     else{ // if it doesn't...just reveal that particular journal entry AND increment entry_number. Throw in an entry# ref too, why not...
          entry_div = $('.journal_entry.' + entry_number.toString())
          entry_div.parent().css("display", "block")
          entry_div.parent().addClass("active")
          entry_div.removeClass("hidden_entry")
          entry_div.addClass("exposed_entry")
          entry_number++
          j2t_map.push(tile)
          $($(".tile")[current]).attr("title", entry_number)
          // and write to the journal...
          write_to_journal(current)
     }
     // surely it's not that simple...
}

function bind_collapsible(){
     collapsible_entries = $(".journal_entry_label") // this is what we click to reveal the entry
     collapsible_entries.each(function(){
          $(this).children("p").on("click", function(){
               /* THIS IS NOT THE WAY TO ACCOMPLISH THIS TASK.
               It SHOULD be easier to have a base height/display and use a class to override it
               But meh...it's just a small project...*/
               $(this).parent().toggleClass("active")
               $(this).siblings(".journal_entry").toggleClass("hidden_entry")
               $(this).siblings(".journal_entry").toggleClass("exposed_entry")
          })
     })
}

// just for fun, try to bind arrow keys to movement
document.addEventListener("keydown", e=>{
          switch(e.keyCode){
               case 37: //left
                    $("#left").click()
                    e.preventDefault();
                    break;
               case 38: //up
                    $("#up").click()
                    e.preventDefault();
                    break;
               case 39: //right
                    $("#right").click()
                    e.preventDefault();
                    break;
               case 40: //down
                    $("#down").click()
                    e.preventDefault();
                    break;
               default:
                    break; // exit if any other key is pressed
          }
     }
)

/* GAME LOGIC */
// map, spaghetti time
function RNGsus(min, max){ // random int generator, inclusive on both ends
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random() * (max - min + 1) + min);
}

to_map = [current]
mapped = []
function generate_map(){

     if(to_map.length == 0){
          generating_map = false
          // loaders, moved from on.load to here so map is generated FIRST
          bind_move();
          bind_paths();
          bind_click_to_move();
          bind_collapsible();
          journal_entry();
          force_exit();
          setup_popup();
          $("#map_wrapper").css("visibility", "unset")
          return void 0
     }
     mapping = to_map.shift() // use shift > pop for more balanced maps. POP is LIFO, causes large scew to one side

     // get how many walls to open
     // allow dead spots...please...otherwise it maps the whole fucking floor
     cutoff = 10 // minimum number of tiles to map
     if(mapped.length < cutoff)
          to_open = RNGsus(2, 4);
     else {
          to_open = RNGsus(0, 3);
     }

     set_event(mapping)

     if(to_open == 4){ // open all walls, no need for logic.
          if(mapping - 27 >= 0){
               $($(".tile")[mapping]).css("border-top-color", "white");
               $($(".tile")[mapping-27]).css("border-bottom-color", "white");
          }
          if(mapping + 27 < (27 * 27)){
               $($(".tile")[mapping]).css("border-bottom-color", "white");
               $($(".tile")[mapping+27]).css("border-top-color", "white");
          }
          if((mapping-1) % 27 != 26 && (mapping-1) >= 0 /*cover top left*/){
               $($(".tile")[mapping]).css("border-left-color", "white");
               $($(".tile")[mapping-1]).css("border-right-color", "white");
          }
          if((mapping+1) % 27 != 0){
               $($(".tile")[mapping]).css("border-right-color", "white");
               $($(".tile")[mapping+1]).css("border-left-color", "white");
          }
          if(!to_map.includes(mapping-27) && (mapping - 27 >= 0) && !mapped.includes(mapping-27))
               to_map.push(mapping - 27)
          if(!to_map.includes(mapping+27) && (mapping + 27 < (27 * 27)) && !mapped.includes(mapping+27))
               to_map.push(mapping + 27)
          if(!to_map.includes(mapping-1) && ((mapping-1) % 27 != 26) && (mapping-1) >= 0 && !mapped.includes(mapping-1))
               to_map.push(mapping - 1)
          if(!to_map.includes(mapping+1) && ((mapping+1) % 27 != 0) && !mapped.includes(mapping+1))
               to_map.push(mapping +1)
          $($(".tile")[mapping]).data("paths", 4)
          //$($(".tile")[mapping]).addClass("seen"); //TODO: Comment out - debugging only
          mapped.push(mapping)
          // we don't need this here, we never want a 4 open tile to be the exit. Personal preference, can be changed for "bigger games"
          //set_exit(mapping)
     }else{
          if(!$($(".tile")[mapping]).data('paths')) // because we might have paths opened by other tiles...
               $($(".tile")[mapping]).data('paths', 0)
          for(let i = 0 /*huh?*/; i < to_open; i++){
               open_direction = RNGsus(1, 4) // this is bad, because it could catch an open wall?
               // actually who cares, guess what? it's just more RNG in the map building. Fuck it.
               // actually if you want to fix this "COUNT" number of not-open walls and pull from that then IF logic the rest
               // but that sounds like work. lazy way it is.
               // could also just coin flip every wall...but this is more stupiderer so we're doing this
               switch(open_direction){
                    case 1: // up
                         if(mapping - 27 >= 0){
                              $($(".tile")[mapping]).css("border-top-color", "white");
                              $($(".tile")[mapping-27]).css("border-bottom-color", "white");
                              $($(".tile")[mapping]).data('paths', $($(".tile")[mapping]).data('paths') + 1)
                         }
                         if((!to_map.includes(mapping-27)) && (mapping - 27 >= 0) && !mapped.includes(mapping-27)){ // let's not map out of bounds...
                              if(!$($(".tile")[mapping - 27]).data('paths')) // if it doesn't exist yet, make it happen
                                   $($(".tile")[mapping - 27]).data('paths', 0)
                              $($(".tile")[mapping - 27]).data('paths', $($(".tile")[mapping - 27]).data('paths') + 1) // increment, we opened a path from another tile...
                              to_map.push(mapping - 27)
                         }
                         break;
                    case 2: // down
                         if(mapping + 27 < (27*27)){
                              $($(".tile")[mapping]).css("border-bottom-color", "white");
                              $($(".tile")[mapping+27]).css("border-top-color", "white");
                              $($(".tile")[mapping]).data('paths', $($(".tile")[mapping]).data('paths') + 1)
                         }
                         if(!to_map.includes(mapping+27) && (mapping + 27 < (27 * 27)) && !mapped.includes(mapping+27)){
                              if(!$($(".tile")[mapping + 27]).data('paths')) // if it doesn't exist yet, make it happen
                                   $($(".tile")[mapping + 27]).data('paths', 0)
                              $($(".tile")[mapping + 27]).data('paths', $($(".tile")[mapping + 27]).data('paths') + 1) // increment, we opened a path from another tile...
                              to_map.push(mapping + 27)
                         }
                         break;
                    case 3: // left
                         if((mapping-1) % 27 != 26 && (mapping-1) >= 0 /*cover top left*/){
                              $($(".tile")[mapping]).css("border-left-color", "white");
                              $($(".tile")[mapping-1]).css("border-right-color", "white");
                              $($(".tile")[mapping]).data('paths', $($(".tile")[mapping]).data('paths') + 1)
                         }
                         if(!to_map.includes(mapping-1) && ((mapping-1) % 27 != 26) && (mapping-1) >= 0 && !mapped.includes(mapping-1)){
                              if(!$($(".tile")[mapping - 1]).data('paths')) // if it doesn't exist yet, make it happen
                                   $($(".tile")[mapping - 1]).data('paths', 0)
                              $($(".tile")[mapping - 1]).data('paths', $($(".tile")[mapping - 1]).data('paths') + 1) // increment, we opened a path from another tile...
                              to_map.push(mapping - 1)
                         }
                         break;
                    case 4: // right
                         if((mapping+1) % 27 != 0){
                              $($(".tile")[mapping]).css("border-right-color", "white");
                              $($(".tile")[mapping+1]).css("border-left-color", "white");
                              $($(".tile")[mapping]).data('paths', $($(".tile")[mapping]).data('paths') + 1)
                         }
                         if(!to_map.includes(mapping+1) && ((mapping+1) % 27 != 0) && !mapped.includes(mapping+1)){
                              if(!$($(".tile")[mapping + 1]).data('paths')) // if it doesn't exist yet, make it happen
                                   $($(".tile")[mapping + 1]).data('paths', 0)
                              $($(".tile")[mapping + 1]).data('paths', $($(".tile")[mapping + 1]).data('paths') + 1) // increment, we opened a path from another tile...
                              to_map.push(mapping + 1)
                         }
                         break;
                    default:
                         break;
               }
          }
     }
     // fuck it, we're making it recursive...
     if(!mapped.includes(mapping)){
          mapped.push(mapping)
          // check if only ONE path is open...use html data property, why not use everything available?
          if($($(".tile")[mapping]).data('paths') === 1){
               //console.log("Potential Exit: " + mapping + " with available Paths: " + $($(".tile")[mapping]).data('paths'))
               set_exit(mapping)
          }
     }
     //$($(".tile")[mapping]).addClass("seen"); //TODO: Comment out - debugging only
     setTimeout(generate_map, 10);
     return void 0;
}

// get "coordinate distance"
// you know...we could also just tell it to get a random value from array.length and use that...
// just store the available possible paths.
// might be better LATER.
// especially since I just reliazed we'll need an exit from potential exits...
// and the current log (see force_exit()) is highly inefficient
min_distance_to_exit = 5
distance_to_exit = 0
function set_exit(tile){
     // % gives COLUMN - tile# % 27
     // FLOOR / gives row - Math.floor(tile# / 27)
     tile_column = tile % 27
     tile_row = Math.floor(tile / 27)
     horizontal = Math.abs(column - tile_column)
     vertical = Math.abs(row - tile_row)
     total = horizontal + vertical
     if(total >= min_distance_to_exit && total > distance_to_exit){ // temporary, find a better idea for an exit other than furthest location
          // distance_to_exit = total
          //console.log("Exit changed to: " + tile + " -total distance: " + total)
          if(exit > 0){
               // get a new event
               set_event(exit)
          }
          exit = tile
          $($(".tile")[exit]).data("event", "exit")
     }

     return void 0
}

async function force_exit(){
     get_random = RNGsus((mapped.length - 10), (mapped.length - 1)) // pick from the last 10 tiles...
     while(exit === -1){ // holy shit a while loop...
          min_distance_to_exit -= 1
          await set_exit(mapped[get_random]) // this is so bad...we'd do better looping over the whole array
     }
}

// "events"
// wall - determined by map
// exit - determined by map
// empty - 50% chance?
// enemy - 25% chance?
// heal - 15% chance?
// treasure - 10% chance?
// that should be 100% total...
journal_text = {
     "wall": "That's a wall",
     "exit": "The exit! CHAAARRGGEE!!",
     "empty": "Nothingness",
     "enemy": ["Skelebro", "Slimey Boi", "Goblino", "Duck Dolphin"],
     "heal": "A font of life",
     "treasure": "A chest. Surely empty",
}
num_enemies = journal_text["enemy"].length - 1 // do -1 since we're using it for rng on array size

function write_to_journal(tile_index){
     journal_index = j2t_map.indexOf(tile.toString())
     // okay, go wall by wall...I guess?
     tile = $($(".tile")[tile_index])
     tile_id = parseInt(tile.attr('id'))
     // this is what happens when you don't plan things
     // FIX THIS - REMOVE TEXT AREA FROM JOURNAL FOR GAME PURPOSES
     $($(".journal_entry")[journal_index]).text("")
     // okay well...if it's NOT a wall, we need to check the tile next to it for "event"
     // we probably need to "flag" tiles using the data properly...this bg color thing is insane
     // This should eventually use a switch case...not that we have a lot of events but still...
     // top
     if(tile.css("border-top-color") == "rgb(255, 255, 255)"){
          switch($($(".tile")[tile_id - 27]).data("event")){
               case "exit":
                    $($(".journal_entry")[journal_index]).append("Up: " + journal_text["exit"])
                    break;
               case "empty":
                    $($(".journal_entry")[journal_index]).append("Up: " + journal_text["empty"])
                    break;
               case "enemy":
                    $($(".journal_entry")[journal_index]).append("Up: A wild " + journal_text["enemy"][$($(".tile")[tile_id - 27]).data("enemy")])
                    break;
               case "heal":
                    $($(".journal_entry")[journal_index]).append("Up: " + journal_text["heal"])
                    break;
               case "treasure":
                    $($(".journal_entry")[journal_index]).append("Up: " + journal_text["treasure"])
                    break;
               default:
                    break;
          }
     } else {
          $($(".journal_entry")[journal_index]).append("Up: " + journal_text["wall"])
     }
     // bottom
     if(tile.css("border-bottom-color") == "rgb(255, 255, 255)"){
          switch($($(".tile")[tile_id + 27]).data("event")){
               case "exit":
                    $($(".journal_entry")[journal_index]).append("<br>Down: " + journal_text["exit"])
                    break;
               case "empty":
                    $($(".journal_entry")[journal_index]).append("<br>Down: " + journal_text["empty"])
                    break;
               case "enemy":
                    $($(".journal_entry")[journal_index]).append("<br>Down: A wild " + journal_text["enemy"][$($(".tile")[tile_id + 27]).data("enemy")])
                    break;
               case "heal":
                    $($(".journal_entry")[journal_index]).append("<br>Down: " + journal_text["heal"])
                    break;
               case "treasure":
                    $($(".journal_entry")[journal_index]).append("<br>Down: " + journal_text["treasure"])
                    break;
               default:
                    break;
          }
     } else {
          $($(".journal_entry")[journal_index]).append("<br>Down: " + journal_text["wall"])
     }
     // left
     if(tile.css("border-left-color") == "rgb(255, 255, 255)"){
          switch($($(".tile")[tile_id - 1]).data("event")){
               case "exit":
                    $($(".journal_entry")[journal_index]).append("<br>Left: " + journal_text["exit"])
                    break;
               case "empty":
                    $($(".journal_entry")[journal_index]).append("<br>Left: " + journal_text["empty"])
                    break;
               case "enemy":
                    $($(".journal_entry")[journal_index]).append("<br>Left: A wild " + journal_text["enemy"][$($(".tile")[tile_id - 1]).data("enemy")])
                    break;
               case "heal":
                    $($(".journal_entry")[journal_index]).append("<br>Left: " + journal_text["heal"])
                    break;
               case "treasure":
                    $($(".journal_entry")[journal_index]).append("<br>Left: " + journal_text["treasure"])
                    break;
               default:
                    break;
          }
     } else {
          $($(".journal_entry")[journal_index]).append("<br>Left: " + journal_text["wall"])
     }
     // right
     if(tile.css("border-right-color") == "rgb(255, 255, 255)"){
          switch($($(".tile")[tile_id + 1]).data("event")){
               case "exit":
                    $($(".journal_entry")[journal_index]).append("<br>Right: " + journal_text["exit"])
                    break;
               case "empty":
                    $($(".journal_entry")[journal_index]).append("<br>Right: " + journal_text["empty"])
                    break;
               case "enemy":
                    $($(".journal_entry")[journal_index]).append("<br>Right: A wild " + journal_text["enemy"][$($(".tile")[tile_id + 1]).data("enemy")])
                    break;
               case "heal":
                    $($(".journal_entry")[journal_index]).append("<br>Right: " + journal_text["heal"])
                    break;
               case "treasure":
                    $($(".journal_entry")[journal_index]).append("<br>Right: " + journal_text["treasure"])
                    break;
               default:
                    break;
          }
     } else {
          $($(".journal_entry")[journal_index]).append("<br>Right: " + journal_text["wall"])
     }

}

outer_wrapper = $("#popup_wrapper")
var combat_wrapper
var enemy_wrapper
function setup_popup(){
     outer_wrapper.empty()
     outer_wrapper.css("display", "none")
     // this is gana get nasty quick...inputting innerHTML on the fly. OH WELL
     outer_wrapper[0].innerHTML = "<div id='combat_wrapper'></div>"
     combat_wrapper = $("#combat_wrapper")
     combat_wrapper[0].innerHTML = "<div id='enemy'></div><div id='attack_button'><button id='attack'>Kill - 1 shot wonder</button></div>"
     enemy_wrapper = $("#enemy")
     $("#attack").on("click", function(){
          outer_wrapper.css("display", "none")
     })
}

function set_event(tile){
     // make sure tile is flagged, logic here to add "events"
     if(!$($(".tile")[tile]).data("event") || $($(".tile")[tile]).data("event") == "exit"){
          event_rng = RNGsus(1, 100); // since it's inclusive
          if(event_rng <= 50) // empty
               $($(".tile")[tile]).data("event", "empty")
          else if(event_rng > 50 && event_rng <= 75){ // enemy
               $($(".tile")[tile]).data("event", "enemy")
               enemy = RNGsus(0, num_enemies) // dynamically updates as enemies are added, so there...
               $($(".tile")[tile]).data("enemy", enemy)
          }
          else if(event_rng > 75 && event_rng <= 85) // healing fountain?
               $($(".tile")[tile]).data("event", "heal")
          else // TREASURE!!
               $($(".tile")[tile]).data("event", "treasure")
     }
}

current_hp = 10
max_hp = 10
function bind_damage_test(){
     $("#take_damage").on("click", function(){
          if(current_hp == 0){
               current_hp = 10;
          } else {
               current_hp -= 1
          }
          percent_left = (current_hp / max_hp) * 100;
          $("#current_hp").css("width", percent_left + "%")
          // $("#current_hp")[0].innerHTML = current_hp + " / " + max_hp // eh...add hp readout later...
     })
}

function combat(enemy_index){
     who = journal_text["enemy"][enemy_index]
     outer_wrapper.css("display", "block")
     enemy_wrapper[0].innerHTML = "<p>" + who + "</p>"
}

/* END GAME LOGIC */
// Safety load...Bind buttons here
$(window).on("load", async function(){
     //console.log(location_display)
     //location_display.innerHTML = "Page LOADED"
     await load_tiles();
     await load_journal();
     //what fuckery is this...
     display_initial_location();
     generate_map(); // we can't properly await this because it's recursive...kind of...semi-recursive?
     bind_damage_test();
     get_mobs();
})