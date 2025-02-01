/**
 * @copy https://github.com/qiuye-zhou/mix-core/blob/main/src/utils/execCommandSync.util.ts
 * @file Promise encapsulates asynchronous execution of exec
 * @module utils/execCommandSync.util
 * @description 用于将 exec 通过Promise封装，进行异步执行，让exec执行的Command完成后再继续执行后继代码
 * @author qiuye-zhou <https://github.com/qiuye-zhou>
 */
import { exec } from 'child_process';

export const execCommand = async (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout ? stdout : stderr);
      }
    });
  });
};
