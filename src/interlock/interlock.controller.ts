import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InterlockService } from './interlock.service';

class Data {
  @ApiProperty()
  sn_he: string;
  @ApiProperty()
  part_number: string;
  @ApiProperty()
  lote: string;
  @ApiProperty()
  user: string;
  @ApiProperty()
  status: string;
}

class DataValidate {
  @ApiProperty()
  sn_he: string;
  @ApiProperty()
  lote: string;
  @ApiProperty()
  part_number: string;
  @ApiProperty()
  status?: string;
  @ApiProperty()
  matricula: string;
  @ApiProperty()
  password: string;
}

@ApiTags('interlock')
@Controller('interlock')
export class InterlockController {
  private readonly logger = new Logger(InterlockController.name);

  constructor(private readonly interlockService: InterlockService) {}

  @Get()
  @ApiOperation({ summary: 'Busca Interlocks por lote' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  async Dashboard(@Query('lot') lot: string) {
    this.logger.debug('Querying lot: ', lot);
    return await this.interlockService.dashboardList(lot);
  }

  @Get('/detailsSerialNumber')
  @ApiOperation({ summary: 'Busca Interlocks por lote e serial number' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  async DetailsSerialNumber(
    @Query('lot') lot: string,
    @Query('sn') sn: string,
  ) {
    return await this.interlockService.createDashboardListBySerialNumber(
      lot,
      sn,
    );
  }

  @Get('/access')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  async Login(@Query('mat') mat: string, @Query('pass') pass: string) {
    return await this.interlockService.login(mat, pass);
  }

  @Get('/adm-access')
  @ApiOperation({ summary: 'Login and Close Lote' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  async LoginCloseLot(
    @Query('mat') mat: string,
    @Query('pass') pass: string,
    @Query('lot') lot: string,
  ) {
    return await this.interlockService.loginAndCloseLot(mat, pass, lot);
  }

  @Post()
  @ApiOperation({ summary: 'Interlock' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async updateInterlock(@Body() data: Data) {
    return await this.interlockService.updateInterlock(data);
  }

  @Post('/validate')
  @ApiOperation({ summary: 'Validação ADM Interlock' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async validateInterlock(@Body() data: DataValidate) {
    return await this.interlockService.validateInterlock(data);
  }
}
