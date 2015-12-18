from sys import argv

from project import app


def main():
    debug = False

    if len(argv) > 1 and argv[1] == "debug":
        debug = True
    app.run(host="0.0.0.0", debug=debug)

if __name__ == "__main__":
    main()
