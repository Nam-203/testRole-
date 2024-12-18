import { Test, TestingModule } from '@nestjs/testing';

import { CreateSkillDto } from '@/modules/skills/dto/create-skill.dto';
import { UpdateSkillDto } from '@/modules/skills/dto/update-skill.dto';
import { Skill } from '@/modules/skills/entities/skill.entity';
import { SkillsController } from '@/modules/skills/skills.controller';
import { SkillsService } from '@/modules/skills/skills.service';

describe('SkillsController', () => {
  let skillsController: SkillsController;
  let skillsService: SkillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [
        {
          provide: SkillsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn()
          }
        }
      ]
    }).compile();

    skillsController = module.get<SkillsController>(SkillsController);
    skillsService = module.get<SkillsService>(SkillsService);
  });

  it('should be defined', () => {
    expect(skillsController).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a skill', async () => {
      const createSkillDto: CreateSkillDto = { name: 'Programming', description: 'NestJS' };
      const createdSkill: Skill = {
        id: 1,
        name: 'Programming',
        description: 'TypeScript',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(skillsService, 'create').mockResolvedValue(createdSkill);

      expect(await skillsController.create(createSkillDto)).toEqual(createdSkill);
      expect(skillsService.create).toHaveBeenCalledWith(createSkillDto);
    });
  });

  describe('findAll', () => {
    const skills = [
      { id: 1, name: 'Programming', description: 'NestJS', createdAt: new Date(), updatedAt: new Date() }
    ];

    it('should return all skills', async () => {
      jest.spyOn(skillsService, 'findAll').mockResolvedValue(skills);

      expect(await skillsController.findAll()).toEqual(skills);
      expect(skillsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const skill = { id: 1, name: 'Programming', description: 'NestJS', createdAt: new Date(), updatedAt: new Date() };

    it('should return a skill by ID', async () => {
      jest.spyOn(skillsService, 'findOne').mockResolvedValue(skill);

      expect(await skillsController.findOne(1)).toEqual(skill);
      expect(skillsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    const skill = { id: 2, name: 'Programming', description: 'NextJS', createdAt: new Date(), updatedAt: new Date() };
    const updateSkillDto: UpdateSkillDto = { name: 'Tester' };

    it('should update a skill by ID', async () => {
      jest.spyOn(skillsService, 'update').mockResolvedValue(skill);

      expect(await skillsController.update(2, updateSkillDto)).toEqual(skill);
      expect(skillsService.update).toHaveBeenCalledWith(1, updateSkillDto);
    });
  });
});
