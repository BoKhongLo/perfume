import { Body, Controller, Post, Res, StreamableFile, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuardRestApi } from 'src/auth/guard';
import { SearchUserDto } from './dtos';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @UseGuards(JwtGuardRestApi)
    @Post('export-file')
    async ExportFileController(
        @Body() dto : SearchUserDto,
        @Request() req,
        @Res({ passthrough: true }) res: Response
    )  {
        const data : Uint8Array = await this.userService.GetReportUser(dto, req.user)
        return new StreamableFile(data, {
            type: 'text/csv',
            disposition: 'attachment; filename="report-product.csv"',
          });
    }
}
