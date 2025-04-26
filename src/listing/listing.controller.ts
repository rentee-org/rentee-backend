import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';
import { UploadService } from 'src/common/services/upload.service';
import { ApiResponse } from 'src/common/dto/response.dto';
import { UploadApiResponse } from 'cloudinary';
import { Public } from 'src/auth/decorators/public.decorator';
import { FilterListingDto } from './dto/filter-listing.dto';

@Controller('listings')
export class ListingController {
  constructor(
    private listingService: ListingService,
    private uploadService: UploadService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.OWNER)
  @Post()
  create(@Body() dto: CreateListingDto, @Request() req) {
    return this.listingService.create(dto, req.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.OWNER, Role.RENTER, Role.ADMIN)
  findAll() {
    return this.listingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingService.findOne(id);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['available', 'rented', 'inactive'] })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findFiltered(@Query() query: FilterListingDto) {
    return this.listingService.findFiltered(query);
  }


  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.OWNER)
  @Public()
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(@UploadedFile() file: File): Promise<ApiResponse<UploadApiResponse>> {
    const result = await this.uploadService.uploadImage(file);
    let response: ApiResponse<UploadApiResponse> = {
      success: true,
      message: 'Image uploaded successfully',
      data: result,
    };
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.OWNER)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateListingDto) {
    return this.listingService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Listing archived successfully' })
  @Roles(Role.OWNER)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.listingService.remove(id);
  }

}
