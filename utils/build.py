#!/usr/bin/env python

import os
import sys
import shutil

try:
    import cStringIO as StringIO
except ImportError:
    import StringIO


FILES = [
    'src/PathFinding.js',
    'src/core/BaseFinder.js',
    ]


def merge_files(file_paths):
    buffer = StringIO.StringIO()

    for file_path in file_paths:
        fin = open(file_path, 'r')
        shutil.copyfileobj(fin, buffer)
     
    buffer.seek(0)
    return buffer


def write_file(file_obj, output_path):
    dir_name = os.path.dirname(output_path)
    if not os.path.exists(dir_name):
        print 'created folder:', dir_name
        os.makedirs(dir_name)

    print file_obj.getvalue();

    fout = open(output_path, 'w')
    shutil.copyfileobj(file_obj, fout)
    fout.close()


def build_all(file_paths, output_path):
    write_file(merge_files(file_paths), output_path)


def get_project_path():
    return os.path.abspath(
              os.path.join(
                  os.path.dirname(__file__),
                  os.path.pardir))


def main():
    project_path = get_project_path()

    output_path = os.path.join(
                      project_path,
                      'build',
                      'PathFinding.js')

    file_paths = [os.path.join(project_path, filename)
                      for filename in FILES]

    try:
        build_all(file_paths, output_path)
    except IOError, e:
        print e

if __name__ == '__main__':
    main()
