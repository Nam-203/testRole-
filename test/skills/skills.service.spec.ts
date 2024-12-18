import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSkillDto } from '@/modules/skills/dto/create-skill.dto';
import { UpdateSkillDto } from '@/modules/skills/dto/update-skill.dto';
import { Skill } from '@/modules/skills/entities/skill.entity';
import { SkillsService } from '@/modules/skills/skills.service';

const skills = [
  { name: 'Programming', description: 'NestJS' },
  { name: 'Programming', description: 'PHP' }
];

describe('SkillsService', () => {
  let skillsService: SkillsService;
  let skillRepository: Repository<Skill>;

  const mockSkillsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        {
          provide: getRepositoryToken(Skill),
          useValue: mockSkillsRepository
        }
      ]
    }).compile();

    skillsService = module.get<SkillsService>(SkillsService);
    skillRepository = module.get<Repository<Skill>>(getRepositoryToken(Skill));
  });

  it('should be defined', () => {
    expect(skillsService).toBeDefined();
  });

  describe('create()', () => {
    const skillDto: CreateSkillDto = { name: 'Programming', description: 'NestJS' };
    const createdSkill: Skill = {
      id: 1,
      name: 'Programming',
      description: 'NestJS',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const savedSkill: Skill = {
      id: 1,
      name: 'Programming',
      description: 'NestJS',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should successfully create a skill', async () => {
      jest.spyOn(skillRepository, 'create').mockImplementation((skillDto) => createdSkill);
      jest.spyOn(skillRepository, 'save').mockResolvedValueOnce(createdSkill);

      await expect(skillsService.create(skillDto)).resolves.toEqual(savedSkill);
    });

    it('should throw an error when saving the skill fails', async () => {
      jest.spyOn(skillRepository, 'create').mockImplementation((skillDto) => createdSkill);
      jest.spyOn(skillRepository, 'save').mockRejectedValueOnce(new Error('Database error'));

      await expect(skillsService.create(skillDto)).rejects.toThrow('Database error');
    });
  });

  describe('findAll()', () => {
    const skills: Skill[] = [
      { id: 1, name: 'Programming', description: 'NestJS', createdAt: new Date(), updatedAt: new Date() }
    ];

    it('should return all skills', async () => {
      jest.spyOn(skillRepository, 'find').mockResolvedValueOnce(skills);

      await expect(skillsService.findAll()).resolves.toEqual(skills);
    });

    it('should return an empty array when no skills exist', async () => {
      jest.spyOn(skillRepository, 'find').mockResolvedValueOnce([]);

      await expect(skillsService.findAll()).resolves.toEqual([]);
    });
  });

  describe('findOne()', () => {
    const skill: Skill = {
      id: 1,
      name: 'Programming',
      description: 'NestJS',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should return a skill when it exists', async () => {
      jest.spyOn(skillRepository, 'findOne').mockResolvedValueOnce(skill);

      await expect(skillsService.findOne(1)).resolves.toEqual(skill);
    });

    it('should throw an error when the skill does not exist', async () => {
      jest.spyOn(skillRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(skillsService.findOne(1)).rejects.toThrow('Skill not found');
    });

    it('should throw an error when findOne method of repository throws an error', async () => {
      jest.spyOn(skillRepository, 'findOne').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(skillsService.findOne(1)).rejects.toThrow('Database error');
    });
  });

  describe('update()', () => {
    const updateSkillDto: UpdateSkillDto = { name: 'Programming', description: 'NestJS' };
    const updatedSkill: Skill = {
      id: 1,
      name: 'Programming',
      description: 'NestJS',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should update and return a skill', async () => {
      jest.spyOn(skillRepository, 'findOne').mockResolvedValueOnce(updatedSkill);
      jest.spyOn(skillRepository, 'save').mockResolvedValueOnce(updatedSkill);

      await expect(skillsService.update(1, updateSkillDto)).resolves.toEqual(updatedSkill);
    });

    it('should throw an error when the skill does not exist', async () => {
      jest.spyOn(skillRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(skillsService.update(1, updateSkillDto)).rejects.toThrow('Skill not found');
    });

    it('should throw an error when findOne method of repository throws an error', async () => {
      jest.spyOn(skillRepository, 'findOne').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(skillsService.update(1, updateSkillDto)).rejects.toThrow('Database error');
    });
  });

  describe('remove()', () => {
    it('should remove a skill when it exists', async () => {
      jest.spyOn(skillRepository, 'delete').mockResolvedValueOnce({ affected: 1, raw: [] });

      await expect(skillsService.remove(1)).resolves.toBeUndefined();
    });

    it('should throw an error when the skill does not exist', async () => {
      jest.spyOn(skillRepository, 'delete').mockResolvedValueOnce({ affected: 0, raw: [] });

      await expect(skillsService.remove(1)).rejects.toThrow('Skill not found');
    });

    it('should throw an error when delete method of repository throws an error', async () => {
      jest.spyOn(skillRepository, 'delete').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(skillsService.remove(1)).rejects.toThrow('Database error');
    });
  });
});
