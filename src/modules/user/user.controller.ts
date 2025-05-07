import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LikeService } from './like/like.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly likeService : LikeService
  ) {}
  @Get()
  getUsers(){
    return this.userService.findAll();
  }
  @Get(":id")
  getUser(@Param("id") id : string){
    return this.userService.getUser(+id);
  }
  @Get(":id/matches")
  getUserMatches(@Param("id") id : string){
    return this.userService.getMatches(+id);
  }
  @Get(":id/sug")
  getUserSuggestions(@Param("id") id : string){
    return this.userService.getUserSuggestions(+id);
  }
  @Post()
  createUser(@Body() createUserDTO : CreateUserDTO){
    return this.userService.createUser(createUserDTO);
  }
  @Post(":id")
  likeUser(@Param("id") likerId : string, @Body() body : { likedId : string }){
    return this.likeService.createLike(+likerId, +body.likedId);
  }
}
