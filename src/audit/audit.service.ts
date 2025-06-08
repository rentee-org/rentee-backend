import { Injectable } from '@nestjs/common';
import { CreateAuditDto } from './dto/create-audit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { Audit } from './entities/audit.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
  ) {}

  async log(dto: CreateAuditDto): Promise<Audit> {
    const audit = this.auditRepository.create(dto);
    return this.auditRepository.save(audit);
  }

  async findAll() {
    const audits = await this.auditRepository.find();
    if (!audits || audits.length === 0) {
      throw new Error('No audits found');
    }
    return audits;
  }

  findOne(id: string) {
    return this.auditRepository.findOne({
      where: { id },
    }).then(audit => {
      if (!audit) {
        throw new Error(`Audit with ID ${id} not found`);
      }
      return audit;
    });
  }

  remove(id: string) {
    return this.auditRepository.delete(id).then(result => {
      if (result.affected === 0) {
        throw new Error(`Audit with ID ${id} not found`);
      }
      return { message: 'Audit deleted successfully' };
    });
  }
}
