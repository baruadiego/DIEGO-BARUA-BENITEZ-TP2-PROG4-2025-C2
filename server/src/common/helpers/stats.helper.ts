import { log } from 'console';
import { GroupBy } from 'src/modules/statistics/dto/stat.dto';

export const meses = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export const dias = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];

export const makeGroupBy = (groupBy?: GroupBy) => {
  let response;

  switch (groupBy) {
    case GroupBy.DAY_OF_WEEK:
      response = { $dayOfWeek: '$localCreatedAt' };
      break;
    case GroupBy.DAY_OF_MONTH:
      response = { $dayOfMonth: '$localCreatedAt' };
      break;
    case GroupBy.MONTH:
      response = { $month: '$localCreatedAt' };
      break;
    case GroupBy.YEAR:
      response = { $year: '$localCreatedAt' };
      break;
    case GroupBy.USER:
      response = { author: '$author.userName' };
      break;
    case GroupBy.POST:
      response = { postId: '$post.title' };
      break;
    default:
      response = { $month: '$localCreatedAt' };
      break;
  }

  return response;
};

export const makeResponse = (
  posts: any,
  groupBy?: GroupBy,
  startDate?: string,
  endDate?: string,
) => {
  let result = {};
  switch (groupBy) {
    case GroupBy.YEAR:
      result = {};

      const start = startDate
        ? new Date(startDate).getFullYear()
        : new Date().getFullYear();
      const end = endDate ? new Date(endDate).getFullYear() : start;

      const from = Math.min(start, end);
      const to = Math.max(start, end);

      for (let y = from; y <= to; y++) {
        result[y] = 0;
      }

      for (const p of posts) {
        const year = p._id;
        result[year] = p.total;
      }
      break;

    case GroupBy.MONTH:
      result = Object.fromEntries(meses.map((m) => [m, 0]));
      for (const p of posts) {
        const mesNombre = meses[p._id - 1];
        result[mesNombre] = p.total;
      }
      break;

    case GroupBy.DAY_OF_MONTH:
      for (let i = 1; i <= 31; i++) {
        result[i] = 0;
      }
      for (const p of posts) {
        const dia = p._id;
        result[dia] = p.total;
      }
      break;

    case GroupBy.DAY_OF_WEEK:
      result = Object.fromEntries(dias.map((d) => [d, 0]));
      for (const p of posts) {
        const diaNombre = dias[p._id - 1];
        result[diaNombre] = p.total;
      }
      break;

    case GroupBy.USER:
      result = posts.reduce(
        (acc, item) => {
          const author = Array.isArray(item._id?.author)
            ? item._id.author[0]
            : 'unknown';

          acc[author] = item.total;
          return acc;
        },
        {} as Record<string, number>,
      );
      break;
    
    case GroupBy.POST:
      result = posts.reduce(
        (acc, item) => {
          const postId = Array.isArray(item._id?.postId)
            ? item._id.postId[0]
            : 'unknown';

          acc[postId] = item.total;
          return acc;
        },
        {} as Record<string, number>,
      );
      break;

    default:
      result = Object.fromEntries(posts.map((p) => [p._id, p.total]));
      break;
  }

  return result;
};
