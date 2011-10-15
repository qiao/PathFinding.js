#!/usr/bin/env python

import os
import shutil
import subprocess

try:
    import cStringIO as StringIO
except ImportError:
    import StringIO


MINIFY = True
BANNER = True

FILES = [
    'PathFinding.js',
    'core/Node.js',
    'core/Grid.js',
    'core/BaseFinder.js',

    'modules/Heap.js',
    'modules/Heuristic.js',

    'modules/AStar.js',
    'modules/BreadthFirst.js',
    'modules/BestFirst.js',
    'modules/Dijkstra.js',

    'modules/BiAStar.js',
    'modules/BiBestFirst.js',
    'modules/BiDijkstra.js',
    'modules/BiBreadthFirst.js',
    ]


def merge_files(file_paths):
    buf = StringIO.StringIO()

    for file_path in file_paths:
        fin = open(file_path, 'r')
        shutil.copyfileobj(fin, buf)
     
    buf.seek(0)
    return buf


def uglify(uglify_path, input_path, output_path):
    minified = subprocess.check_output([uglify_path, '--no-copyright', input_path])
    f = open(output_path, 'w')
    f.write(minified)
    f.close()
    print 'created minified file:', output_path


def dump_file_obj(file_obj, output_path):
    dir_name = os.path.dirname(output_path)
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)

        print 'created folder:', dir_name

    fout = open(output_path, 'w')
    shutil.copyfileobj(file_obj, fout)
    fout.close()

    print 'created file:', output_path


def get_project_path():
    return os.path.abspath(
              os.path.join(
                  os.path.dirname(__file__),
                  os.path.pardir))


def add_min_to_filename(filename):
    segs = list(os.path.splitext(filename))
    segs.insert(-1, '.min')
    return ''.join(segs)


def add_banner(banner_path, js_path):
    buf = StringIO.StringIO()
    buf.write(open(banner_path).read())
    buf.write(open(js_path).read())

    buf.seek(0)
    dump_file_obj(buf, js_path)


def main():
    project_path = get_project_path()
    source_path = os.path.join(project_path, 'src')

    output_path = os.path.join(
                      project_path,
                      'build',
                      'PathFinding.js')

    file_paths = [os.path.join(source_path, filename)
                      for filename in FILES]

    uglify_path = os.path.join(project_path, 'utils', 'node_modules', 
            '.bin', 'uglifyjs')

    banner_path = os.path.join(project_path, 'utils', 'banner')


    try:
        dump_file_obj(
            merge_files(file_paths), output_path)

        if MINIFY:
            new_output_path = add_min_to_filename(output_path)
            uglify(uglify_path, 
                   output_path, 
                   new_output_path)
            os.unlink(output_path)

            output_path = new_output_path

        if BANNER:
            add_banner(banner_path, output_path)

    except IOError, e:
        print e


if __name__ == '__main__':
    main()
