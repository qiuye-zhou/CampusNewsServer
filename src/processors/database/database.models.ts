import { CategoryModel } from '~/modules/category/category.model';
import { ConfigOptionModel } from '~/modules/config/config.model';
import { LinkModel } from '~/modules/link/link.model';
import { ProjectModel } from '~/modules/project/project.model';
import { ReadBooksModel } from '~/modules/readbooks/readbooks.model';
import { SaysModel } from '~/modules/says/says.model';
import { UserModel } from '~/modules/user/user.model';
import { getProviderByTypegooseClass } from '~/transformers/model.transformer';

export const datebaseModules = [
  UserModel,
  SaysModel,
  ReadBooksModel,
  ProjectModel,
  CategoryModel,
  LinkModel,
  ConfigOptionModel,
].map((module) => getProviderByTypegooseClass(module));
