import { AnalyzeModel } from '~/modules/analyze/analyze.model';
import { CategoryModel } from '~/modules/category/category.model';
import { ConfigOptionModel } from '~/modules/config/config.model';
import { LinkModel } from '~/modules/link/link.model';
import { NewsModel } from '~/modules/news/news.model';
import { UserModel } from '~/modules/user/user.model';
import { getProviderByTypegooseClass } from '~/transformers/model.transformer';

export const datebaseModules = [
  UserModel,
  NewsModel,
  AnalyzeModel,
  CategoryModel,
  LinkModel,
  ConfigOptionModel,
].map((module) => getProviderByTypegooseClass(module));
