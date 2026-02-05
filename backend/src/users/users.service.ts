import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ListUsersQueryDto } from "./dto/list-users.query.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private sanitizeUser(user: any) {
    // nunca retornar hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          registration: dto.registration,
          passwordHash,
        },
      });

      return this.sanitizeUser(user);
    } catch (err: any) {
      // Prisma unique constraint
      if (err?.code === "P2002") {
        const target = err?.meta?.target?.join?.(", ") ?? "unique field";
        throw new BadRequestException(`Duplicate value for: ${target}`);
      }
      throw err;
    }
  }

  async findAll(query: ListUsersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = query.search
      ? {
          name: {
            contains: query.search,
            mode: "insensitive" as const,
          },
        }
      : {};

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      data: users.map((u) => this.sanitizeUser(u)),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    return this.sanitizeUser(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    // garante que existe
    await this.findOne(id);

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.registration !== undefined) data.registration = dto.registration;
    if (dto.password !== undefined) {
      data.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    try {
      const updated = await this.prisma.user.update({
        where: { id },
        data,
      });
      return this.sanitizeUser(updated);
    } catch (err: any) {
      if (err?.code === "P2002") {
        const target = err?.meta?.target?.join?.(", ") ?? "unique field";
        throw new BadRequestException(`Duplicate value for: ${target}`);
      }
      throw err;
    }
  }

  async remove(id: string) {
    // garante que existe
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: "User deleted successfully" };
  }
}
