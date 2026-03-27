import { Body, Controller, Post, Res, StreamableFile, UseGuards, Request } from '@nestjs/common';
import { ProductService } from './product.service';
import { SearchProductDto } from './dtos';
import { createReadStream } from 'fs';
import { JwtGuardRestApi } from 'src/auth/guard';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
    ) { }

    @UseGuards(JwtGuardRestApi)
    @Post('export-file')
    async ExportFileController(
        @Body() dto : SearchProductDto,
        @Request() req,
        @Res({ passthrough: true }) res: Response
    )  {

        const data : Uint8Array = await this.productService.GetReportProduct(dto)
        return new StreamableFile(data, {
            type: 'text/csv',
            disposition: 'attachment; filename="report-product.csv"',
          });
    }

}
