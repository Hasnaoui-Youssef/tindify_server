import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";


export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  firstName : string;

  @IsNotEmpty()
  @IsString()
  lastName : string;

  @IsNotEmpty()
  @IsEmail()
  email : string;

  @IsArray()
  @IsString({each : true})
  @ArrayMinSize(1)
  songs : string[];


  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  photos : PhotoDTO[];
}

export class PhotoDTO {

  @IsNotEmpty()
  @IsString()
  URI : string;

}
